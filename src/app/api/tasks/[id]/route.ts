import { getDb } from "@/lib/db";
import { generalTasks } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { title, priority, status, dueDate } = await request.json() as any;
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const taskId = parseInt(params.id);

        const updatedTask = await db.update(generalTasks)
            .set({
                title,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                updatedAt: new Date(),
            })
            .where(eq(generalTasks.id, taskId))
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
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const taskId = parseInt(params.id);

        await db.update(generalTasks)
            .set({ deletedAt: new Date() })
            .where(eq(generalTasks.id, taskId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
