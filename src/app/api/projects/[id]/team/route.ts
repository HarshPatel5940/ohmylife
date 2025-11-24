import { getDb } from "@/lib/db";
import { people } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/server-auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = parseInt(params.id);
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);

    const teamMembers = await db.select().from(people).where(eq(people.projectId, projectId));

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Failed to fetch team members", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const userIsAdmin = await isAdmin(env);

    if (!userIsAdmin) {
      return NextResponse.json(
        { error: "Only admins can add team members" },
        { status: 403 }
      );
    }

    const { personId } = (await request.json()) as { personId: number };
    const projectId = parseInt(params.id);

    if (!personId) {
      return NextResponse.json({ error: "Person ID is required" }, { status: 400 });
    }

    const db = getDb(env);

    const updatedPerson = await db
      .update(people)
      .set({
        projectId: projectId,
        updatedAt: new Date(),
      })
      .where(eq(people.id, personId))
      .returning();

    return NextResponse.json(updatedPerson[0]);
  } catch (error) {
    console.error("Failed to add team member", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
