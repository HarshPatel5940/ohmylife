import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { verifyPassword, signToken } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const { username, password } = await request.json() as { username?: string; password?: string };

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = getDb(env);



        const user = await db.select().from(users).where(eq(users.username, username)).get();

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signToken({ id: user.id, username: user.username, role: user.role });

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
