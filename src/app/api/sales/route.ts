import { getDb } from "@/lib/db";
import { transactions, clients } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, isNull, eq, and, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        let allTransactions;
        if (type) {
            allTransactions = await db.select({
                ...getTableColumns(transactions),
                clientName: clients.name
            })
                .from(transactions)
                .leftJoin(clients, eq(transactions.clientId, clients.id))
                .where(and(eq(transactions.type, type as any), isNull(transactions.deletedAt)))
                .orderBy(desc(transactions.createdAt));
        } else {
            allTransactions = await db.select({
                ...getTableColumns(transactions),
                clientName: clients.name
            })
                .from(transactions)
                .leftJoin(clients, eq(transactions.clientId, clients.id))
                .where(isNull(transactions.deletedAt))
                .orderBy(desc(transactions.createdAt));
        }

        return NextResponse.json(allTransactions);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as any;
        const { type, description, amount, category, clientId, invoiceNumber, status, dueDate, amountReceived, personId, paymentMethod } = body;

        if (!amount || !type) {
            return NextResponse.json({ error: "Amount and type are required" }, { status: 400 });
        }

        const { env } = getCloudflareContext();
        const db = getDb(env);


        let finalInvoiceNumber = invoiceNumber;
        if (type === 'income' && !finalInvoiceNumber) {
            finalInvoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
        }

        const parsedAmount = parseFloat(amount);
        const parsedReceived = amountReceived ? parseFloat(amountReceived) : (type === 'expense' ? parsedAmount : 0);

        const newTransaction = await db.insert(transactions).values({
            type,
            description: description || (type === 'income' ? 'Sale' : 'Expense'),
            amount: parsedAmount,
            category: category || (type === 'income' ? 'sales' : 'other'),
            date: new Date(),

            invoiceNumber: type === 'income' ? finalInvoiceNumber : null,
            clientId: type === 'income' && clientId ? parseInt(clientId) : null,
            amountReceived: type === 'income' ? parsedReceived : null,
            status: type === 'income' ? (status || 'draft') : null,
            dueDate: type === 'income' && dueDate ? new Date(dueDate) : null,

            personId: type === 'expense' && personId ? parseInt(personId) : null,
            paymentMethod: type === 'expense' ? paymentMethod : null,
        }).returning();

        return NextResponse.json(newTransaction[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
