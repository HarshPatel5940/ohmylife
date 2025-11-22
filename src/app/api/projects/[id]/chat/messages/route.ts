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
        const projectId = params.id;

        // Check if CHAT_ROOM binding exists (production only)
        if (!env.CHAT_ROOM) {
            console.warn("CHAT_ROOM Durable Object not available (local dev)");
            return NextResponse.json([]);
        }

        const id = env.CHAT_ROOM.idFromName(projectId);
        const stub = env.CHAT_ROOM.get(id);

        const response = await stub.fetch("http://do/messages");
        if (!response.ok) {
            throw new Error(`DO returned ${response.status}`);
        }

        const messages = await response.json();
        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages from DO", error);
        // Return empty array instead of error for better UX
        return NextResponse.json([]);
    }
}
