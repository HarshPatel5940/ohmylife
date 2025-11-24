import { getDb } from "@/lib/db";
import { excalidrawDrawings } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { invalidateFileCache } from "@/lib/cache";

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

export async function GET(request: Request, { params }: { params: { id: string } }) {
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as { name: string };
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const projectId = parseInt(params.id);

    const currentUser = await getAuthenticatedUser(env);
    const createdBy = currentUser?.id || 1;

    const key = `excalidraw/${projectId}/${Date.now()}-${name}.json`;

    const emptyDrawing = createEmptyDrawing();

    await env.BUCKET.put(key, JSON.stringify(emptyDrawing), {
      httpMetadata: {
        contentType: "application/json",
      },
    });

    const newDrawing = await db
      .insert(excalidrawDrawings)
      .values({
        projectId,
        name,
        key,
        createdBy,
      })
      .returning();

    await invalidateFileCache(env, projectId);

    return NextResponse.json(newDrawing[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
