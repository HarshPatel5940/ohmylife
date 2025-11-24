import { getDb } from "@/lib/db";
import { people } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const userIsAdmin = await isAdmin(env);

    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Only admins can remove team members" },
        { status: 403 }
      );
    }
    const projectId = parseInt(params.id);
    const memberId = parseInt(params.memberId);

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
