import { getDb } from "@/lib/db";
import { chatMessages, users } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const projectId = parseInt(params.id);

        const messages = await db.select({
            id: chatMessages.id,
            content: chatMessages.content,
            createdAt: chatMessages.createdAt,
            userId: chatMessages.userId,
            senderName: users.username,
        })
            .from(chatMessages)
            .leftJoin(users, eq(chatMessages.userId, users.id))
            .where(eq(chatMessages.projectId, projectId))
            .orderBy(desc(chatMessages.createdAt))
            .limit(50);

        return NextResponse.json(messages.reverse());
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
