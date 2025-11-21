import { getDb } from "@/lib/db";
import { clients, projects, transactions } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);

        const allClients = await db.select().from(clients).where(isNull(clients.deletedAt)).orderBy(desc(clients.createdAt));

        // Fetch project counts and revenue for each client
        const clientsWithStats = await Promise.all(
            allClients.map(async (client) => {
                // Get project count
                const projectCount = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(projects)
                    .where(and(eq(projects.clientId, client.id), isNull(projects.deletedAt)))
                    .then(res => res[0]?.count || 0);

                // Get total revenue
                const revenueResult = await db
                    .select({ total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` })
                    .from(transactions)
                    .where(
                        and(
                            eq(transactions.clientId, client.id),
                            eq(transactions.type, 'income'),
                            isNull(transactions.deletedAt)
                        )
                    )
                    .then(res => res[0]?.total || 0);

                return {
                    ...client,
                    projectCount,
                    totalRevenue: revenueResult,
                };
            })
        );

        return NextResponse.json(clientsWithStats);
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

        const { env } = getCloudflareContext();
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
