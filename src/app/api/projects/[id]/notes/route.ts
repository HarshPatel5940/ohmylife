import { getDb } from "@/lib/db";
import { notes, users } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";


export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const projectId = parseInt(params.id);

        const projectNotes = await db.select({
            id: notes.id,
            projectId: notes.projectId,
            userId: notes.userId,
            title: notes.title,
            content: notes.content,
            createdAt: notes.createdAt,
            updatedAt: notes.updatedAt,
            creatorName: users.username,
        })
            .from(notes)
            .leftJoin(users, eq(notes.userId, users.id))
            .where(and(eq(notes.projectId, projectId), isNull(notes.deletedAt)))
            .orderBy(desc(notes.createdAt));

        return NextResponse.json(projectNotes);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { cookies } from "next/headers";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { content } = await request.json() as any;
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const projectId = parseInt(params.id);


        const token = cookies().get("token")?.value;
        const payload = token ? await verifyToken(token) : null;
        const userId = payload?.id || null;
        const username = payload?.username || null;

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const newNote = await db.insert(notes).values({
            projectId,
            userId,
            content,
        }).returning();

        return NextResponse.json({
            ...newNote[0],
            creatorName: username
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
