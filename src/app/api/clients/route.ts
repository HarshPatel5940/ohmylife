import { getDb } from "@/lib/db";
import { clients } from "@/db/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getRequestContext();
        const db = getDb(env);

        const allClients = await db.select().from(clients).where(isNull(clients.deletedAt)).orderBy(desc(clients.createdAt));

        return NextResponse.json(allClients);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, email, company, phone } = await request.json() as any;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const { env } = getRequestContext();
        const db = getDb(env);

        const newClient = await db.insert(clients).values({
            name,
            email,
            company,
            phone,
        }).returning();

        return NextResponse.json(newClient[0]);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
