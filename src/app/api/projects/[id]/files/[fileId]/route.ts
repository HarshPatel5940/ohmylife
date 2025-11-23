import { getDb } from "@/lib/db";
import { files } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const fileId = parseInt(params.fileId);

    const file = await db.select().from(files).where(eq(files.id, fileId)).get();

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await env.BUCKET.delete(file.key);

    await db.delete(files).where(eq(files.id, fileId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
