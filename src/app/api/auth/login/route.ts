import { getDb } from "@/lib/db";
import { users, people, sessions } from "@/db/schema";
import { verifyPassword, signToken } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);

    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    let projectId: number | undefined;
    if (user.personId) {
      const person = await db.query.people.findFirst({
        where: eq(people.id, user.personId),
      });
      projectId = person?.projectId || undefined;
    }

    const token = await signToken({
      id: user.id,
      username: user.username,
      role: user.role,
      projectId: projectId,
      canAccessLeads: user.canAccessLeads,
      canAccessFinance: user.canAccessFinance,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const ipAddress =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await db.insert(sessions).values({
      userId: user.id,
      token,
      ipAddress,
      userAgent,
      lastActivityAt: now,
      expiresAt,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
