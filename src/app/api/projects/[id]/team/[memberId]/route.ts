import { getDb } from "@/lib/db";
import { people } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const projectId = parseInt(params.id);
    const memberId = parseInt(params.memberId);

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);

    await db
      .update(people)
      .set({
        projectId: null,
        updatedAt: new Date(),
      })
      .where(eq(people.id, memberId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove team member", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
