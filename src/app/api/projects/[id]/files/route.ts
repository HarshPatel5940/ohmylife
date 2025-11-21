import { getDb } from "@/lib/db";
import { files } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const projectId = parseInt(params.id);

        const projectFiles = await db.select()
            .from(files)
            .where(eq(files.projectId, projectId))
            .orderBy(desc(files.createdAt));

        return NextResponse.json(projectFiles);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = getDb(env);
        const projectId = parseInt(params.id);

        // Generate unique key
        const key = `projects/${projectId}/${Date.now()}-${file.name}`;

        // Upload to R2
        await env.BUCKET.put(key, file);

        // Save metadata to D1
        const newFile = await db.insert(files).values({
            projectId,
            name: file.name,
            key: key,
            size: file.size,
            type: file.type,
            url: `/api/files/${key}`, // Proxy URL or public URL if configured
            uploadedBy: 1, // TODO: Get actual user ID from session
        }).returning();

        return NextResponse.json(newFile[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
