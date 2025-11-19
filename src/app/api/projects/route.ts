import { getDb } from "@/lib/db";
import { projects } from "@/db/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getRequestContext();
        const db = getDb(env);

        const allProjects = await db.select().from(projects).where(isNull(projects.deletedAt)).orderBy(desc(projects.createdAt));

        return NextResponse.json(allProjects);
    } catch (error) {
        console.error("Projects GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, startDate, endDate } = await request.json() as any;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const { env } = getRequestContext();
        const db = getDb(env);

        const newProject = await db.insert(projects).values({
            name,
            description,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            status: "active",
        }).returning();

        return NextResponse.json(newProject[0]);
    } catch (error) {
        console.error("Projects POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
