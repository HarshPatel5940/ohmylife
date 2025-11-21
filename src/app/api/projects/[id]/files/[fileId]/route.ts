import { getDb } from "@/lib/db";
import { files } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; fileId: string } }
) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const fileId = parseInt(params.fileId);

        // Get file info first
        const file = await db.select().from(files).where(eq(files.id, fileId)).get();

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // Delete from R2
        await env.BUCKET.delete(file.key);

        // Delete from D1
        await db.delete(files).where(eq(files.id, fileId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
