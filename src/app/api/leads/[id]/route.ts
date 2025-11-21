import { getDb } from "@/lib/db";
import { leads } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { name, contactMode, description, status, value } = await request.json() as any;
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const leadId = parseInt(params.id);

        const updatedLead = await db.update(leads)
            .set({
                name,
                contactMode,
                description,
                status,
                value: value ? parseInt(value) : null,
                updatedAt: new Date(),
            })
            .where(eq(leads.id, leadId))
            .returning();

        return NextResponse.json(updatedLead[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const leadId = parseInt(params.id);

        await db.update(leads)
            .set({ deletedAt: new Date() })
            .where(eq(leads.id, leadId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
