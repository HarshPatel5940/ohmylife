import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { count } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
    const { env } = getCloudflareContext();
    const db = getDb(env);


    const userCount = await db.select({ count: count() }).from(users);

    if (userCount[0].count > 0) {
        return NextResponse.json({ error: "Setup already completed" }, { status: 400 });
    }


    const passwordHash = await hashPassword("admin123");
    const newUser = await db.insert(users).values({
        username: "admin",
        passwordHash,
        role: "admin",
    }).returning();

    return NextResponse.json({ message: "Admin user created", user: newUser[0] });
}
