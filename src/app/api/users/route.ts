import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const user = await getAuthenticatedUser(env);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb(env);

    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        role: users.role,
        canAccessLeads: users.canAccessLeads,
        canAccessFinance: users.canAccessFinance,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .orderBy(desc(users.createdAt));

    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, password, role, personId, canAccessLeads, canAccessFinance } =
      (await request.json()) as any;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const user = await getAuthenticatedUser(env);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb(env);

    const passwordHash = await hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        username,
        passwordHash,
        role: role || "user",
        personId: personId || null,
        canAccessLeads: canAccessLeads || false,
        canAccessFinance: canAccessFinance || false,
      })
      .returning({
        id: users.id,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt,
      });

    return NextResponse.json(newUser[0]);
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
