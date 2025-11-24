import { getDb } from "@/lib/db";
import { files, excalidrawDrawings } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server-auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const projectId = parseInt(params.id);

    // Get filter from query params
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get('type'); // 'all', 'files', 'drawings'

    // Check if user is admin to show private files
    const userIsAdmin = await isAdmin(env);

    let allItems: any[] = [];

    // Fetch regular files if needed
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'files') {
      const fileConditions = userIsAdmin
        ? eq(files.projectId, projectId)
        : and(eq(files.projectId, projectId), eq(files.isPrivate, false));

      const projectFiles = await db
        .select()
        .from(files)
        .where(fileConditions!)
        .orderBy(desc(files.createdAt));

      allItems.push(...projectFiles.map(f => ({
        ...f,
        itemType: 'file',
        uploadedAt: f.createdAt,
      })));
    }

    // Fetch drawings if needed
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'drawings') {
      const drawingConditions = userIsAdmin
        ? eq(excalidrawDrawings.projectId, projectId)
        : and(eq(excalidrawDrawings.projectId, projectId), eq(excalidrawDrawings.isPrivate, false));

      const projectDrawings = await db
        .select()
        .from(excalidrawDrawings)
        .where(drawingConditions!)
        .orderBy(desc(excalidrawDrawings.createdAt));

      allItems.push(...projectDrawings.map(d => ({
        ...d,
        itemType: 'drawing',
        uploadedAt: d.createdAt,
        size: 0, // Drawings don't have size
        type: 'application/vnd.excalidraw+json',
        url: `/dashboard/projects/${projectId}/excalidraw/${d.id}`,
      })));
    }

    // Sort by date
    allItems.sort((a, b) => {
      const dateA = new Date(a.uploadedAt || 0).getTime();
      const dateB = new Date(b.uploadedAt || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(allItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const projectId = parseInt(params.id);

    const key = `projects/${projectId}/${Date.now()}-${file.name}`;

    await env.BUCKET.put(key, file);

    const newFile = await db
      .insert(files)
      .values({
        projectId,
        name: file.name,
        key: key,
        size: file.size,
        type: file.type,
        url: `/api/files/${key}`,
        uploadedBy: 1,
      })
      .returning();

    return NextResponse.json(newFile[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
