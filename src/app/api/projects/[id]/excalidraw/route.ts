import { getDb } from "@/lib/db";
import { excalidrawDrawings } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

// Empty Excalidraw drawing structure
const createEmptyDrawing = () => ({
    type: "excalidraw",
    version: 2,
    source: "ohmylife",
    elements: [],
    appState: {
        gridSize: null,
        viewBackgroundColor: "#ffffff",
    },
    files: {},
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const projectId = parseInt(params.id);

        const drawings = await db
            .select()
            .from(excalidrawDrawings)
            .where(eq(excalidrawDrawings.projectId, projectId))
            .orderBy(desc(excalidrawDrawings.createdAt));

        return NextResponse.json(drawings);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json() as { name: string };
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const projectId = parseInt(params.id);

        // Generate unique key for R2 storage
        const key = `excalidraw/${projectId}/${Date.now()}-${name}.json`;

        // Create empty drawing data
        const emptyDrawing = createEmptyDrawing();

        // Save to R2
        await env.BUCKET.put(key, JSON.stringify(emptyDrawing), {
            httpMetadata: {
                contentType: "application/json",
            },
        });

        // Save metadata to database
        const newDrawing = await db
            .insert(excalidrawDrawings)
            .values({
                projectId,
                name,
                key,
                createdBy: 1, // TODO: Get from session
            })
            .returning();

        return NextResponse.json(newDrawing[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
