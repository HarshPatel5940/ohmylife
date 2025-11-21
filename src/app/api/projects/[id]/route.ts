import { getDb } from "@/lib/db";
import { projects } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const id = parseInt(params.id);

        const project = await db.select().from(projects).where(eq(projects.id, id)).get();

        if (!project || project.deletedAt) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Project GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const id = parseInt(params.id);


        await db.update(projects)
            .set({ deletedAt: new Date() })
            .where(eq(projects.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Project DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { name, description, clientId, status, startDate, endDate } = await request.json() as any;
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const id = parseInt(params.id);

        const updatedProject = await db.update(projects)
            .set({
                name,
                description,
                clientId: clientId ? parseInt(clientId) : null,
                status,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, id))
            .returning();

        return NextResponse.json(updatedProject[0]);
    } catch (error) {
        console.error("Project PATCH error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
