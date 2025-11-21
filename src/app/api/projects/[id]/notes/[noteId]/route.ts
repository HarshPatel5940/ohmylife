import { getDb } from "@/lib/db";
import { notes } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PATCH(
    request: Request,
    { params }: { params: { id: string; noteId: string } }
) {
    try {
        const { content } = await request.json() as any;
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const noteId = parseInt(params.noteId);

        const updatedNote = await db.update(notes)
            .set({
                content,
                updatedAt: new Date(),
            })
            .where(eq(notes.id, noteId))
            .returning();

        return NextResponse.json(updatedNote[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; noteId: string } }
) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const noteId = parseInt(params.noteId);

        await db.update(notes)
            .set({ deletedAt: new Date() })
            .where(eq(notes.id, noteId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
