import { getDb } from "@/lib/db";
import { people } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-auth";

export async function GET(request: Request) {
  try {
    requireAdmin(request);

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);

    const allPeople = await db
      .select()
      .from(people)
      .where(isNull(people.deletedAt))
      .orderBy(desc(people.createdAt));

    return NextResponse.json(allPeople);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    requireAdmin(request);

    const { name, role, email, phone, status } = (await request.json()) as any;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env);

    const newPerson = await db
      .insert(people)
      .values({
        name,
        role,
        email,
        phone,
        status: status || "active",
      })
      .returning();

    return NextResponse.json(newPerson[0]);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
