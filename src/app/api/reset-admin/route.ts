import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
    const { env } = getCloudflareContext();
    const db = getDb(env);

    try {
        // Delete existing admin if any
        await db.delete(users).where(eq(users.username, "admin"));

        // Create admin user
        const passwordHash = await hashPassword("admin123");
        const newUser = await db.insert(users).values({
            username: "admin",
            passwordHash,
            role: "admin",
        }).returning();

        return NextResponse.json({ message: "Admin user reset successfully", user: newUser[0] });
    } catch (error) {
        console.error("Reset error:", error);
        return NextResponse.json({ error: "Failed to reset admin" }, { status: 500 });
    }
}
