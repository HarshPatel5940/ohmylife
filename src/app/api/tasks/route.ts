import { getDb } from "@/lib/db";
import { tasks, people } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const url = new URL(request.url);
        const projectId = url.searchParams.get("projectId");
        const type = url.searchParams.get("type");

        let query = db.select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            createdAt: tasks.createdAt,
            updatedAt: tasks.updatedAt,
            assigneeId: tasks.assigneeId,
            assigneeName: people.name,
            type: tasks.type,
            projectId: tasks.projectId,
        })
            .from(tasks)
            .leftJoin(people, eq(tasks.assigneeId, people.id))
            .where(isNull(tasks.deletedAt))
            .orderBy(desc(tasks.createdAt))
            .$dynamic();

        if (projectId) {
            query = query.where(and(isNull(tasks.deletedAt), eq(tasks.projectId, parseInt(projectId))));
        } else if (type === "personal") {
            query = query.where(and(isNull(tasks.deletedAt), eq(tasks.type, "personal")));
        }

        const result = await query;

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to fetch tasks", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, priority, status, dueDate, type, projectId, assigneeId } = await request.json() as any;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);

        const newTask = await db.insert(tasks).values({
            title,
            description: description || null,
            priority: priority || "medium",
            status: status || "todo",
            dueDate: dueDate ? new Date(dueDate) : null,
            type: type || "personal",
            projectId: projectId ? parseInt(projectId) : null,
            assigneeId: assigneeId ? parseInt(assigneeId) : null,
        }).returning();

        return NextResponse.json(newTask[0]);
    } catch (error) {
        console.error("Failed to create task", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
