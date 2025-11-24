import { getDb } from "@/lib/db";
import { excalidrawDrawings } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server-auth";
import { invalidateFileCache } from "@/lib/cache";

export async function GET(
  request: Request,
  { params }: { params: { id: string; drawingId: string } }
) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const projectId = parseInt(params.id);
    const drawingId = parseInt(params.drawingId);

    const drawing = await db
      .select()
      .from(excalidrawDrawings)
      .where(and(eq(excalidrawDrawings.id, drawingId), eq(excalidrawDrawings.projectId, projectId)))
      .limit(1);

    if (drawing.length === 0) {
      return NextResponse.json({ error: "Drawing not found" }, { status: 404 });
    }

    const object = await env.BUCKET.get(drawing[0].key);
    if (!object) {
      return NextResponse.json({ error: "Drawing data not found in storage" }, { status: 404 });
    }

    const data = await object.text();
    const drawingData = JSON.parse(data);

    return NextResponse.json({
      ...drawing[0],
      data: drawingData,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; drawingId: string } }
) {
  try {
    const body = (await request.json()) as { data?: any; name?: string };
    const { data, name } = body;

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const projectId = parseInt(params.id);
    const drawingId = parseInt(params.drawingId);

    const drawing = await db
      .select()
      .from(excalidrawDrawings)
      .where(and(eq(excalidrawDrawings.id, drawingId), eq(excalidrawDrawings.projectId, projectId)))
      .limit(1);

    if (drawing.length === 0) {
      return NextResponse.json({ error: "Drawing not found" }, { status: 404 });
    }

    if (data) {
      await env.BUCKET.put(drawing[0].key, JSON.stringify(data), {
        httpMetadata: {
          contentType: "application/json",
        },
      });
    }

    if (name && name !== drawing[0].name) {
      await db
        .update(excalidrawDrawings)
        .set({
          name,
          updatedAt: new Date(),
        })
        .where(eq(excalidrawDrawings.id, drawingId));
    } else {
      await db
        .update(excalidrawDrawings)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(excalidrawDrawings.id, drawingId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; drawingId: string } }
) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const projectId = parseInt(params.id);
    const drawingId = parseInt(params.drawingId);

    const drawing = await db
      .select()
      .from(excalidrawDrawings)
      .where(and(eq(excalidrawDrawings.id, drawingId), eq(excalidrawDrawings.projectId, projectId)))
      .limit(1);

    if (drawing.length === 0) {
      return NextResponse.json({ error: "Drawing not found" }, { status: 404 });
    }

    await env.BUCKET.delete(drawing[0].key);

    if (drawing[0].thumbnailKey) {
      await env.BUCKET.delete(drawing[0].thumbnailKey);
    }

    await db.delete(excalidrawDrawings).where(eq(excalidrawDrawings.id, drawingId));

    await invalidateFileCache(env, projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; drawingId: string } }
) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const projectId = parseInt(params.id);
    const userIsAdmin = await isAdmin(env);

    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const drawingId = parseInt(params.drawingId);
    const { isPrivate } = (await request.json()) as { isPrivate: boolean };

    await db
      .update(excalidrawDrawings)
      .set({ isPrivate })
      .where(eq(excalidrawDrawings.id, drawingId));

    await invalidateFileCache(env, projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
