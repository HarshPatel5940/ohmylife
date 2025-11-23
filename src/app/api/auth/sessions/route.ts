import { getDb } from "@/lib/db";
import { sessions } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, and, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const currentUser = await getAuthenticatedUser(env);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb(env);
    const now = new Date();

    const userSessions = await db
      .select({
        id: sessions.id,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        lastActivityAt: sessions.lastActivityAt,
        createdAt: sessions.createdAt,
        expiresAt: sessions.expiresAt,
        token: sessions.token,
      })
      .from(sessions)
      .where(and(eq(sessions.userId, currentUser.id), gt(sessions.expiresAt, now)))
      .orderBy(sessions.lastActivityAt);

    const cookieStore = cookies();
    const currentToken = cookieStore.get("token")?.value;

    const sessionsWithCurrent = userSessions.map((session) => ({
      ...session,
      isCurrent: !!currentToken && session.token.trim() === currentToken.trim(),
      token: undefined,
    }));

    return NextResponse.json(sessionsWithCurrent);
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const currentUser = await getAuthenticatedUser(env);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, revokeAll, password } = (await request.json()) as {
      sessionId?: number;
      revokeAll?: boolean;
      password: string;
    };

    if (!password) {
      return NextResponse.json({ error: "Password is required for this action" }, { status: 400 });
    }

    const db = getDb(env);

    const { verifyPassword } = await import("@/lib/auth");
    const { users } = await import("@/db/schema");

    const user = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const cookieStore = cookies();
    const currentToken = cookieStore.get("token")?.value;

    if (revokeAll) {
      await db.delete(sessions).where(
        and(
          eq(sessions.userId, currentUser.id),

          ...(currentToken ? [eq(sessions.token, currentToken)] : [])
        )
      );

      return NextResponse.json({
        success: true,
        message: "All other sessions revoked",
      });
    } else if (sessionId) {
      const session = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      });

      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      if (session.userId !== currentUser.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      await db.delete(sessions).where(eq(sessions.id, sessionId));

      return NextResponse.json({
        success: true,
        message: "Session revoked",
      });
    } else {
      return NextResponse.json({ error: "sessionId or revokeAll required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
