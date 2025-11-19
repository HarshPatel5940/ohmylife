import { getDb } from "@/lib/db";
import { invoices } from "@/db/schema";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { desc, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getRequestContext();
        const db = getDb(env);

        const allInvoices = await db.select().from(invoices).where(isNull(invoices.deletedAt)).orderBy(desc(invoices.createdAt));

        return NextResponse.json(allInvoices);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { invoiceNumber, amount, status, dueDate } = await request.json() as any;

        if (!invoiceNumber || !amount) {
            return NextResponse.json({ error: "Invoice number and amount are required" }, { status: 400 });
        }

        const { env } = getRequestContext();
        const db = getDb(env);

        const newInvoice = await db.insert(invoices).values({
            invoiceNumber,
            amount: parseFloat(amount),
            status: status || "pending",
            dueDate: dueDate ? new Date(dueDate) : null,
            date: new Date(),
            items: "[]",
        }).returning();

        return NextResponse.json(newInvoice[0]);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
