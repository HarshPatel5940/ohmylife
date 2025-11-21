import { getDb } from "@/lib/db";
import { projectTasks } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string; taskId: string } }
) {
    try {
        const { title, status, priority, assigneeId, dueDate } = await request.json() as any;
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const taskId = parseInt(params.taskId);

        const updated = await db
            .update(projectTasks)
            .set({
                title,
                status,
                priority,
                assigneeId: assigneeId ? parseInt(assigneeId) : null,
                dueDate: dueDate ? new Date(dueDate) : null,
                updatedAt: new Date(),
            })
            .where(eq(projectTasks.id, taskId))
            .returning();

        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; taskId: string } }
) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const taskId = parseInt(params.taskId);

        await db
            .update(projectTasks)
            .set({ deletedAt: new Date() })
            .where(eq(projectTasks.id, taskId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
