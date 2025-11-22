// @ts-ignore
import { default as handler } from "../.open-next/worker.js";
import { getDb } from "./lib/db";
import { chatMessages } from "./db/schema";
import { DurableObject } from "cloudflare:workers";

export class ChatRoom extends DurableObject {
    sessions: Set<WebSocket>;
    env: CloudflareEnv;
    sql: any;

    constructor(ctx: DurableObjectState, env: CloudflareEnv) {
        super(ctx, env);
        this.sessions = new Set();
        this.env = env;
        this.sql = ctx.storage.sql;

        // Initialize database
        this.sql.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                projectId INTEGER,
                userId INTEGER,
                senderName TEXT,
                content TEXT,
                createdAt INTEGER
            );
            CREATE TABLE IF NOT EXISTS unread_counts (
                userId INTEGER PRIMARY KEY,
                count INTEGER DEFAULT 0
            );
        `);
    }

    async fetch(request: Request) {
        const url = new URL(request.url);

        if (url.pathname === "/websocket") {
            if (request.headers.get("Upgrade") !== "websocket") {
                return new Response("Expected Upgrade: websocket", { status: 426 });
            }

            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            this.handleSession(server);

            return new Response(null, { status: 101, webSocket: client });
        }

        if (url.pathname === "/messages") {
            const messages = this.sql.exec(`SELECT * FROM messages ORDER BY createdAt DESC LIMIT 50`).toArray();
            return new Response(JSON.stringify(messages.reverse()), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (url.pathname.startsWith("/unread/")) {
            const userId = parseInt(url.pathname.split("/").pop() || "0");
            const result = this.sql.exec(`SELECT count FROM unread_counts WHERE userId = ?`, userId).one();
            return new Response(JSON.stringify({ count: result ? result.count : 0 }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response("Not found", { status: 404 });
    }

    async handleSession(webSocket: WebSocket) {
        this.sessions.add(webSocket);
        webSocket.accept();

        webSocket.addEventListener("message", async (event) => {
            try {
                const data = JSON.parse(event.data as string);

                if (data.type === "message") {
                    // Save to SQLite
                    const createdAt = Date.now();
                    this.sql.exec(`
                        INSERT INTO messages (projectId, userId, senderName, content, createdAt)
                        VALUES (?, ?, ?, ?, ?)
                    `, data.projectId, data.userId, data.senderName, data.content, createdAt);

                    const newMessage = {
                        ...data,
                        createdAt,
                        id: this.sql.exec("SELECT last_insert_rowid() as id").one().id
                    };

                    // Broadcast message
                    const broadcastData = JSON.stringify({
                        type: "message",
                        message: newMessage
                    });

                    this.sessions.forEach((session) => {
                        if (session.readyState === WebSocket.OPEN) {
                            session.send(broadcastData);
                        }
                    });

                    // Update unread counts for others (simplified logic: increment for everyone else)
                    // In a real app, you'd track who is in the room.
                    // For now, we'll just increment for users who are NOT the sender if we knew who they were.
                    // Since we don't track user IDs in sessions yet, we'll skip complex unread logic for now
                    // or implement a basic version if needed.
                } else if (data.type === "typing") {
                    const broadcastData = JSON.stringify({
                        type: "typing",
                        userId: data.userId,
                        senderName: data.senderName,
                        isTyping: data.isTyping
                    });

                    this.sessions.forEach((session) => {
                        if (session !== webSocket && session.readyState === WebSocket.OPEN) {
                            session.send(broadcastData);
                        }
                    });
                }
            } catch (err) {
                console.error("Error handling message", err);
            }
        });

        webSocket.addEventListener("close", () => {
            this.sessions.delete(webSocket);
        });
    }
}


const worker = {
    async fetch(request: Request, env: any, ctx: any) {
        const url = new URL(request.url);

        // Intercept WebSocket requests for chat to bypass OpenNext/Next.js
        // This avoids the "RangeError: Responses may only be constructed with status codes in the range 200 to 599"
        if (url.pathname.match(/^\/api\/projects\/[^/]+\/chat$/) && request.headers.get("Upgrade") === "websocket") {
            const projectId = url.pathname.split("/")[3];
            const id = env.CHAT_ROOM.idFromName(projectId);
            const stub = env.CHAT_ROOM.get(id);

            // Rewrite URL to match what ChatRoom expects
            const doUrl = new URL(request.url);
            doUrl.pathname = "/websocket";

            return stub.fetch(doUrl.toString(), request);
        }

        return handler.fetch(request, env, ctx);
    }
};

export default worker;
