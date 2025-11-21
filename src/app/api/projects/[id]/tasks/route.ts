import { getDb } from "@/lib/db";
import { projectTasks } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const projectId = parseInt(params.id);

        const tasks = await db
            .select()
            .from(projectTasks)
            .where(and(eq(projectTasks.projectId, projectId), isNull(projectTasks.deletedAt)));

        return NextResponse.json(tasks);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const { title, status, priority, assigneeId, dueDate } = await request.json() as any;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = getDb(env);
        const projectId = parseInt(params.id);

        const newTask = await db.insert(projectTasks).values({
            projectId,
            title,
            status: status || "todo",
            priority: priority || "medium",
            assigneeId: assigneeId ? parseInt(assigneeId) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
        }).returning();

        return NextResponse.json(newTask[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
