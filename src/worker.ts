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

    this.sql.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                projectId INTEGER,
                userId INTEGER,
                senderName TEXT,
                content TEXT,
                replyToId INTEGER,
                replyToContent TEXT,
                replyToSender TEXT,
                createdAt INTEGER
            );
            CREATE TABLE IF NOT EXISTS unread_counts (
                userId INTEGER PRIMARY KEY,
                count INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS message_reads (
                messageId INTEGER,
                userId INTEGER,
                userName TEXT,
                readAt INTEGER,
                PRIMARY KEY (messageId, userId)
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
      const messages = this.sql
        .exec(`SELECT * FROM messages ORDER BY createdAt DESC LIMIT 50`)
        .toArray();

      const messagesWithReads = messages.map((msg: any) => {
        const reads = this.sql
          .exec(`SELECT userId, userName, readAt FROM message_reads WHERE messageId = ?`, msg.id)
          .toArray();
        return { ...msg, readBy: reads };
      });

      return new Response(JSON.stringify(messagesWithReads.reverse()), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname.startsWith("/unread/")) {
      const userId = parseInt(url.pathname.split("/").pop() || "0");
      const result = this.sql
        .exec(`SELECT count FROM unread_counts WHERE userId = ?`, userId)
        .one();
      return new Response(JSON.stringify({ count: result ? result.count : 0 }), {
        headers: { "Content-Type": "application/json" },
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
          const createdAt = Date.now();
          this.sql.exec(
            `
                        INSERT INTO messages (projectId, userId, senderName, content, replyToId, replyToContent, replyToSender, createdAt)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `,
            data.projectId,
            data.userId,
            data.senderName,
            data.content,
            data.replyToId || null,
            data.replyToContent || null,
            data.replyToSender || null,
            createdAt
          );

          const newMessage = {
            ...data,
            createdAt,
            id: this.sql.exec("SELECT last_insert_rowid() as id").one().id,
          };

          const broadcastData = JSON.stringify({
            type: "message",
            message: newMessage,
          });

          this.sessions.forEach((session) => {
            if (session.readyState === WebSocket.OPEN) {
              session.send(broadcastData);
            }
          });
        } else if (data.type === "edit") {
          this.sql.exec(
            `
                        UPDATE messages SET content = ? WHERE id = ?
                    `,
            data.content,
            data.messageId
          );

          const broadcastData = JSON.stringify({
            type: "message_updated",
            messageId: data.messageId,
            content: data.content,
          });

          this.sessions.forEach((session) => {
            if (session.readyState === WebSocket.OPEN) {
              session.send(broadcastData);
            }
          });
        } else if (data.type === "typing") {
          const broadcastData = JSON.stringify({
            type: "typing",
            userId: data.userId,
            senderName: data.senderName,
            isTyping: data.isTyping,
          });

          this.sessions.forEach((session) => {
            if (session !== webSocket && session.readyState === WebSocket.OPEN) {
              session.send(broadcastData);
            }
          });
        } else if (data.type === "mark_read") {
          const readAt = Date.now();

          for (const messageId of data.messageIds || []) {
            this.sql.exec(
              `
                            INSERT OR REPLACE INTO message_reads (messageId, userId, userName, readAt)
                            VALUES (?, ?, ?, ?)
                        `,
              messageId,
              data.userId,
              data.userName,
              readAt
            );
          }

          const broadcastData = JSON.stringify({
            type: "read_receipt_update",
            messageIds: data.messageIds,
            userId: data.userId,
            userName: data.userName,
            readAt,
          });

          this.sessions.forEach((session) => {
            if (session.readyState === WebSocket.OPEN) {
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

    if (
      url.pathname.match(/^\/api\/projects\/[^/]+\/chat$/) &&
      request.headers.get("Upgrade") === "websocket"
    ) {
      const projectId = url.pathname.split("/")[3];
      const id = env.CHAT_ROOM.idFromName(projectId);
      const stub = env.CHAT_ROOM.get(id);

      const doUrl = new URL(request.url);
      doUrl.pathname = "/websocket";

      return stub.fetch(doUrl.toString(), request);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
