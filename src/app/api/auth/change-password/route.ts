import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const currentUser = await getAuthenticatedUser(env);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = (await request.json()) as any;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 4 || newPassword.length > 25) {
      return NextResponse.json(
        { error: "Password must be between 4 and 25 characters" },
        { status: 400 }
      );
    }

    const db = getDb(env);

    const user = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const newPasswordHash = await hashPassword(newPassword);
    const now = new Date();

    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        passwordChangedAt: now,
        updatedAt: now,
      })
      .where(eq(users.id, currentUser.id));

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
