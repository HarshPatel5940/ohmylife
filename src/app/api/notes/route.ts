import { getDb } from "@/lib/db";
import { notes, projects } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);

        const allNotes = await db.select({
            ...getTableColumns(notes),
            projectName: projects.name
        })
            .from(notes)
            .leftJoin(projects, eq(notes.projectId, projects.id))
            .where(isNull(notes.deletedAt))
            .orderBy(desc(notes.createdAt));

        return NextResponse.json(allNotes);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, content, projectId } = await request.json() as any;

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = getDb(env);

        const newNote = await db.insert(notes).values({
            title: title || "Untitled Note",
            content,
            projectId: projectId ? parseInt(projectId) : null,
        }).returning();

        return NextResponse.json(newNote[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
