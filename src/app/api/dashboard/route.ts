import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { clients, projects, transactions, users, tasks, leads } from "@/db/schema";
import { count, desc, eq, sql, isNull } from "drizzle-orm";

export const dynamic = "force-dynamic";

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
      recentProjects,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      projectTasks,
      personalTasks,
    ] = await Promise.all([
      db.select({ count: count() }).from(clients),
      db.select({ count: count() }).from(projects).where(isNull(projects.deletedAt)),
      db.select({ count: count() }).from(transactions).where(eq(transactions.type, "income")),
      db
        .select({ count: count() })
        .from(tasks)
        .where(sql`${tasks.status} != 'done'`),
      db.select({ count: count() }).from(leads).where(eq(leads.status, "new")),
      db
        .select()
        .from(projects)
        .where(isNull(projects.deletedAt))
        .orderBy(desc(projects.createdAt))
        .limit(5),
      db
        .select({ count: count() })
        .from(tasks)
        .where(sql`${tasks.priority} = 'high' AND ${tasks.status} != 'done'`),
      db
        .select({ count: count() })
        .from(tasks)
        .where(sql`${tasks.priority} = 'medium' AND ${tasks.status} != 'done'`),
      db
        .select({ count: count() })
        .from(tasks)
        .where(sql`${tasks.priority} = 'low' AND ${tasks.status} != 'done'`),
      db
        .select({ count: count() })
        .from(tasks)
        .where(sql`${tasks.type} = 'project' AND ${tasks.status} != 'done'`),
      db
        .select({ count: count() })
        .from(tasks)
        .where(sql`${tasks.type} = 'personal' AND ${tasks.status} != 'done'`),
    ]);

    return NextResponse.json({
      totalClients: clientsCount[0].count,
      totalProjects: projectsCount[0].count,
      totalSales: salesCount[0].count,
      activeTasks: activeTasksCount[0].count,
      newLeads: leadsCount[0].count,
      recentProjects: recentProjects,
      tasksByPriority: {
        high: highPriorityTasks[0].count,
        medium: mediumPriorityTasks[0].count,
        low: lowPriorityTasks[0].count,
      },
      tasksByType: {
        project: projectTasks[0].count,
        personal: personalTasks[0].count,
      },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
