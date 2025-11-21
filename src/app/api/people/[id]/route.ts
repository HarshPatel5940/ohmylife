import { getDb } from "@/lib/db";
import { people } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { name, role, email, phone, status } = await request.json() as any;
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const personId = parseInt(params.id);

        const updatedPerson = await db.update(people)
            .set({
                name,
                role,
                email,
                phone: (request as any).phone,
                status,
                updatedAt: new Date(),
            })
            .where(eq(people.id, personId))
            .returning();

        return NextResponse.json(updatedPerson[0]);
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
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);
        const personId = parseInt(params.id);

        await db.update(people)
            .set({ deletedAt: new Date() })
            .where(eq(people.id, personId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
