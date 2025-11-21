import { getDb } from "@/lib/db";
import { leads } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);

        const allLeads = await db.select().from(leads).where(isNull(leads.deletedAt)).orderBy(desc(leads.createdAt));

        return NextResponse.json(allLeads);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { clientId, status, value, source } = await request.json() as any;

        const { env } = getCloudflareContext();
        const db = getDb(env);

        const newLead = await db.insert(leads).values({
            clientId: clientId ? parseInt(clientId) : null,
            status: status || "new",
            value: value ? parseInt(value) : null,
            source,
        }).returning();

        return NextResponse.json(newLead[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
