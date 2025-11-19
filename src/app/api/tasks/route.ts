import { getDb } from "@/lib/db";
import { generalTasks } from "@/db/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getRequestContext();
        const db = getDb(env);

        const tasks = await db.select().from(generalTasks).where(isNull(generalTasks.deletedAt)).orderBy(desc(generalTasks.createdAt));

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, priority, status } = await request.json() as any;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const { env } = getRequestContext();
        const db = getDb(env);

        const newTask = await db.insert(generalTasks).values({
            title,
            priority: priority || "medium",
            status: status || "todo",
        }).returning();

        return NextResponse.json(newTask[0]);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
