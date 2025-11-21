import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { clients, projects, transactions, users } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);


        const [
            clientsCount,
            projectsCount,
            salesCount,
            recentProjects
        ] = await Promise.all([
            db.select({ count: count() }).from(clients),
            db.select({ count: count() }).from(projects),
            db.select({ count: count() }).from(transactions).where(eq(transactions.type, 'income')),
            db.select().from(projects).orderBy(desc(projects.createdAt)).limit(5)
        ]);

        return NextResponse.json({
            totalClients: clientsCount[0].count,
            totalProjects: projectsCount[0].count,
            totalSales: salesCount[0].count,
            recentProjects: recentProjects
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
