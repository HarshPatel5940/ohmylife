import { getDb } from "@/lib/db";
import { sessions } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, and, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const currentUser = await getAuthenticatedUser(env);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = parseInt(params.id);
    const db = getDb(env);

    const userSessions = await db.query.sessions.findMany({
      where: and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())),
      orderBy: (sessions, { desc }) => [desc(sessions.lastActivityAt)],
    });

    return NextResponse.json(userSessions);
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const currentUser = await getAuthenticatedUser(env);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = parseInt(params.id);
    const { sessionId, revokeAll } = (await request.json()) as {
      sessionId?: number;
      revokeAll?: boolean;
    };

    const db = getDb(env);

    if (revokeAll) {
      await db.delete(sessions).where(eq(sessions.userId, userId));

      return NextResponse.json({
        success: true,
        message: "All sessions revoked successfully",
      });
    } else if (sessionId) {
      await db.delete(sessions).where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));

      return NextResponse.json({
        success: true,
        message: "Session revoked successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Either sessionId or revokeAll must be specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error revoking user sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
