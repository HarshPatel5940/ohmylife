import { getDb } from "@/lib/db";
import { notes } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const projectId = parseInt(params.id);

        const projectNotes = await db.select()
            .from(notes)
            .where(and(eq(notes.projectId, projectId), isNull(notes.deletedAt)))
            .orderBy(desc(notes.createdAt));

        return NextResponse.json(projectNotes);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { content } = await request.json() as any;
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const projectId = parseInt(params.id);

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const newNote = await db.insert(notes).values({
            projectId,
            content,
        }).returning();

        return NextResponse.json(newNote[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
