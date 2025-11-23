import { getDb } from "@/lib/db";
import { notes } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title, content, projectId } = (await request.json()) as any;

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);

    await db
      .update(notes)
      .set({
        title,
        content,
        projectId: projectId ? parseInt(projectId) : null,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);

    await db
      .update(notes)
      .set({ deletedAt: new Date() })
      .where(eq(notes.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
