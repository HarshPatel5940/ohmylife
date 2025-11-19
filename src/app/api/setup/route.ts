import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import { count } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
    const { env } = getRequestContext();
    const db = getDb(env);

    // Check if any user exists
    const userCount = await db.select({ count: count() }).from(users);

    if (userCount[0].count > 0) {
        return NextResponse.json({ error: "Setup already completed" }, { status: 400 });
    }

    // Create admin user
    const passwordHash = await hashPassword("admin123");
    const newUser = await db.insert(users).values({
        username: "admin",
        passwordHash,
        role: "admin",
    }).returning();

    return NextResponse.json({ message: "Admin user created", user: newUser[0] });
}
