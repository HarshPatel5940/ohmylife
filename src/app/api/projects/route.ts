import { getDb } from "@/lib/db";
import { projects, clients } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);

        const allProjects = await db.select({
            ...getTableColumns(projects),
            clientName: clients.name
        })
            .from(projects)
            .leftJoin(clients, eq(projects.clientId, clients.id))
            .where(isNull(projects.deletedAt))
            .orderBy(desc(projects.createdAt));

        return NextResponse.json(allProjects);
    } catch (error) {
        console.error("Projects GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, clientId, startDate, endDate } = await request.json() as any;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = getDb(env);

        const newProject = await db.insert(projects).values({
            name,
            description,
            clientId: clientId ? parseInt(clientId) : null,
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
