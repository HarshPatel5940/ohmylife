import { getDb } from "@/lib/db";
import { projects } from "@/db/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { env } = getRequestContext();
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
        const { env } = getRequestContext();
        const db = getDb(env);
        const id = parseInt(params.id);

        // Soft delete
        await db.update(projects)
            .set({ deletedAt: new Date() })
            .where(eq(projects.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Project DELETE error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
