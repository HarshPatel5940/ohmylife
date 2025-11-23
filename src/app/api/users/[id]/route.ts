import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const currentUser = await getAuthenticatedUser(env);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as any;
    const userId = parseInt(params.id);

    const db = getDb(env);

    if (body.adminPassword && body.newPassword) {
      const { adminPassword, newPassword } = body;

      if (newPassword.length < 4 || newPassword.length > 25) {
        return NextResponse.json(
          { error: "Password must be between 4 and 25 characters" },
          { status: 400 }
        );
      }

      const admin = await db.query.users.findFirst({
        where: eq(users.id, currentUser.id),
      });

      if (!admin) {
        return NextResponse.json({ error: "Admin not found" }, { status: 404 });
      }

      const isAdminPasswordValid = await verifyPassword(adminPassword, admin.passwordHash);
      if (!isAdminPasswordValid) {
        return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
      }

      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!targetUser || targetUser.deletedAt) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
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
        .where(eq(users.id, userId));

      return NextResponse.json({
        success: true,
        message: "Password reset successfully",
      });
    } else if (body.hasOwnProperty("canAccessLeads") || body.hasOwnProperty("canAccessFinance")) {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (body.hasOwnProperty("canAccessLeads")) {
        updateData.canAccessLeads = body.canAccessLeads;
      }
      if (body.hasOwnProperty("canAccessFinance")) {
        updateData.canAccessFinance = body.canAccessFinance;
      }

      await db.update(users).set(updateData).where(eq(users.id, userId));

      return NextResponse.json({
        success: true,
        message: "Permissions updated successfully",
      });
    } else {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
