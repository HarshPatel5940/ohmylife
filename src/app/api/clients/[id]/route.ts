import { getDb } from "@/lib/db";
import { clients } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const clientId = parseInt(params.id);

    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, email, company, phone } = (await request.json()) as any;
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const clientId = parseInt(params.id);

    const updatedClient = await db
      .update(clients)
      .set({
        name,
        email,
        company,
        phone,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, clientId))
      .returning();

    return NextResponse.json(updatedClient[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);
    const clientId = parseInt(params.id);

    await db.update(clients).set({ deletedAt: new Date() }).where(eq(clients.id, clientId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
