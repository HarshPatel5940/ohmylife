import { getDb } from "@/lib/db";
import { transactions, projects } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, and, gte, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);

        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("clientId");
        const projectId = searchParams.get("projectId");
        const type = searchParams.get("type");
        const timeFilter = searchParams.get("timeFilter");


        let startDate: Date | null = null;
        const now = new Date();

        if (timeFilter) {
            switch (timeFilter) {
                case "30d":
                    startDate = new Date(now);
                    startDate.setDate(startDate.getDate() - 30);
                    break;
                case "3m":
                    startDate = new Date(now);
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case "1y":
                    startDate = new Date(now);
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                case "fy":
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();


                    const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
                    startDate = new Date(fyStartYear, 3, 1);
                    break;
                case "cy":
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
            }
        }


        const conditions = [isNull(transactions.deletedAt)];

        if (clientId) {
            conditions.push(eq(transactions.clientId, parseInt(clientId)));
        }

        if (projectId) {
            conditions.push(eq(transactions.projectId, parseInt(projectId)));
        }

        if (type) {
            conditions.push(eq(transactions.type, type as "income" | "expense"));
        }

        if (startDate) {
            conditions.push(gte(transactions.date, startDate));
        }

        const allTransactions = await db.select({
            id: transactions.id,
            type: transactions.type,
            description: transactions.description,
            amount: transactions.amount,
            date: transactions.date,
            category: transactions.category,
            projectId: transactions.projectId,
            clientId: transactions.clientId,
            invoiceNumber: transactions.invoiceNumber,
            amountReceived: transactions.amountReceived,
            status: transactions.status,
            dueDate: transactions.dueDate,
            personId: transactions.personId,
            paymentMethod: transactions.paymentMethod,
            createdAt: transactions.createdAt,
            updatedAt: transactions.updatedAt,
            projectName: projects.name,
        })
            .from(transactions)
            .leftJoin(projects, eq(transactions.projectId, projects.id))
            .where(and(...conditions))
            .orderBy(desc(transactions.date));

        return NextResponse.json(allTransactions);
    } catch (error) {
        console.error("Transactions API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as any;
        const {
            type,
            description,
            amount,
            date,
            category,
            projectId,
            clientId,
            invoiceNumber,
            status,
            dueDate,
            personId,
            paymentMethod
        } = body;

        if (!type || !description || !amount || !date) {
            return NextResponse.json(
                { error: "Type, description, amount, and date are required" },
                { status: 400 }
            );
        }

        const { env } = getCloudflareContext();
        const db = getDb(env);


        let finalClientId = clientId;
        if (projectId && !clientId) {
            const project = await db.select({ clientId: projects.clientId })
                .from(projects)
                .where(eq(projects.id, parseInt(projectId)))
                .limit(1);

            if (project.length > 0) {
                finalClientId = project[0].clientId;
            }
        }

        const newTransaction = await db.insert(transactions).values({
            type,
            description,
            amount: parseInt(amount),
            date: new Date(date),
            category,
            projectId: projectId ? parseInt(projectId) : null,
            clientId: finalClientId ? parseInt(finalClientId) : null,
            invoiceNumber,
            amountReceived: type === "income" ? parseInt(body.amountReceived || 0) : null,
            status: type === "income" ? (status || "draft") : null,
            dueDate: dueDate ? new Date(dueDate) : null,
            personId: personId ? parseInt(personId) : null,
            paymentMethod: type === "expense" ? paymentMethod : null,
        }).returning();

        return NextResponse.json(newTransaction[0]);
    } catch (error) {
        console.error("Failed to create transaction", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
