import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { clients, projects, transactions, users, tasks, leads } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { env } = await getCloudflareContext({ async: true });
        const db = getDb(env);


        const [
            clientsCount,
            projectsCount,
            salesCount,
            activeTasksCount,
            leadsCount,
            recentProjects
        ] = await Promise.all([
            db.select({ count: count() }).from(clients),
            db.select({ count: count() }).from(projects),
            db.select({ count: count() }).from(transactions).where(eq(transactions.type, 'income')),
            db.select({ count: count() }).from(tasks).where(eq(tasks.status, 'todo')), // Or 'in_progress' too? Let's just say 'todo' for now or not 'done'
            db.select({ count: count() }).from(leads).where(eq(leads.status, 'new')),
            db.select().from(projects).orderBy(desc(projects.createdAt)).limit(5)
        ]);

        return NextResponse.json({
            totalClients: clientsCount[0].count,
            totalProjects: projectsCount[0].count,
            totalSales: salesCount[0].count,
            activeTasks: activeTasksCount[0].count,
            newLeads: leadsCount[0].count,
            recentProjects: recentProjects
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
