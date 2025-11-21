import { getDb } from "@/lib/db";
import { tasks } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { title, description, priority, status, dueDate, assigneeId } = await request.json() as any;
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const taskId = parseInt(params.id);

        const updatedTask = await db.update(tasks)
            .set({
                title,
                description,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                assigneeId: assigneeId ? parseInt(assigneeId) : null,
                updatedAt: new Date(),
            })
            .where(eq(tasks.id, taskId))
            .returning();

        return NextResponse.json(updatedTask[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const taskId = parseInt(params.id);

        await db.update(tasks)
            .set({ deletedAt: new Date() })
            .where(eq(tasks.id, taskId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
