import { getDb } from "@/lib/db";
import { projects } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { getOrCache, CacheKeys, CacheTTL } from "@/lib/cache";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const user = await getAuthenticatedUser(env);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const db = getDb(env);

    if (user.role !== "admin") {
      if (!user.personId) {
        return NextResponse.json(
          { error: "Forbidden - No person record associated" },
          { status: 403 }
        );
      }

      const { people } = await import("@/db/schema");

      const teamMember = await db
        .select()
        .from(people)
        .where(sql`${people.id} = ${user.personId} AND ${people.projectId} = ${id}`)
        .get();

      if (!teamMember) {
        return NextResponse.json(
          { error: "Forbidden - You are not a member of this project" },
          { status: 403 }
        );
      }
    }

    // Cache project metadata
    const project = await getOrCache(
      env,
      CacheKeys.projectMetadata(id),
      async () => {
        return await db.select().from(projects).where(eq(projects.id, id)).get();
      },
      CacheTTL.projectMetadata
    );

    if (!project || project.deletedAt) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const user = await getAuthenticatedUser(env);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { password } = (await request.json()) as { password: string };

    if (!password) {
      return NextResponse.json({ error: "Password is required for this action" }, { status: 400 });
    }

    const db = getDb(env);
    const id = parseInt(params.id);

    const { verifyPassword } = await import("@/lib/auth");
    const { users } = await import("@/db/schema");

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await verifyPassword(password, currentUser.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await db.update(projects).set({ deletedAt: new Date() }).where(eq(projects.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, clientId, status, startDate, endDate } =
      (await request.json()) as any;
    const { env } = await getCloudflareContext({ async: true });
    const user = await getAuthenticatedUser(env);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb(env);
    const id = parseInt(params.id);

    const updatedProject = await db
      .update(projects)
      .set({
        name,
        description,
        clientId: clientId ? parseInt(clientId) : null,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    // Invalidate project cache
    const { invalidateProjectCache } = await import("@/lib/cache");
    await invalidateProjectCache(env, id);

    return NextResponse.json(updatedProject[0]);
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
