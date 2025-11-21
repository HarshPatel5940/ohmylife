/// <reference path="../../../cloudflare-env.d.ts" />
import { getDb } from "../../lib/db";
import { chatMessages } from "../../db/schema";
import { DurableObject } from "cloudflare:workers";

export class ChatRoom extends DurableObject {
    sessions: Set<WebSocket>;
    env: CloudflareEnv;

    constructor(ctx: DurableObjectState, env: CloudflareEnv) {
        super(ctx, env);
        this.sessions = new Set();
        this.env = env;
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

        return new Response("Not found", { status: 404 });
    }

    async handleSession(webSocket: WebSocket) {
        this.sessions.add(webSocket);
        webSocket.accept();

        webSocket.addEventListener("message", async (event) => {
            try {
                const data = JSON.parse(event.data as string);
                // data: { projectId, userId, content, senderName }

                // Save to DB
                const db = getDb(this.env);
                const newMessage = await db.insert(chatMessages).values({
                    projectId: data.projectId,
                    userId: data.userId,
                    content: data.content,
                    createdAt: new Date(),
                }).returning();

                // Broadcast to all
                const broadcastData = JSON.stringify({
                    ...newMessage[0],
                    senderName: data.senderName
                });

                this.sessions.forEach((session) => {
                    try {
                        session.send(broadcastData);
                    } catch (err) {
                        this.sessions.delete(session);
                    }
                });
            } catch (err) {
                console.error("Error handling message", err);
            }
        });

        webSocket.addEventListener("close", () => {
            this.sessions.delete(webSocket);
        });
    }
}
