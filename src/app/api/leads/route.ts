import { getDb } from "@/lib/db";
import { leads } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);

        const allLeads = await db.select().from(leads).where(isNull(leads.deletedAt)).orderBy(desc(leads.createdAt));

        return NextResponse.json(allLeads);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, contactMode, description, status, value } = await request.json() as any;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);

        const newLead = await db.insert(leads).values({
            name,
            contactMode,
            description,
            status: status || "new",
            value: value ? parseInt(value) : null,
        }).returning();

        return NextResponse.json(newLead[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
