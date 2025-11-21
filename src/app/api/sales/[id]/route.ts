import { getDb } from "@/lib/db";
import { transactions } from "@/db/schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json() as any;
        const { type, description, amount, category, clientId, invoiceNumber, status, dueDate, amountReceived, personId, paymentMethod } = body;

        const { env } = getCloudflareContext();
        const db = getDb(env);
        const transactionId = parseInt(params.id);

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (description !== undefined) updateData.description = description;
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (category !== undefined) updateData.category = category;
        if (type !== undefined) updateData.type = type;

        // Income specific
        if (invoiceNumber !== undefined) updateData.invoiceNumber = invoiceNumber;
        if (clientId !== undefined) updateData.clientId = clientId ? parseInt(clientId) : null;
        if (amountReceived !== undefined) updateData.amountReceived = parseFloat(amountReceived);
        if (status !== undefined) updateData.status = status;
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

        // Expense specific
        if (personId !== undefined) updateData.personId = personId ? parseInt(personId) : null;
        if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;

        const updated = await db.update(transactions)
            .set(updateData)
            .where(eq(transactions.id, transactionId))
            .returning();

        return NextResponse.json(updated[0]);
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
        const { env } = getCloudflareContext();
        const db = getDb(env);
        const transactionId = parseInt(params.id);

        await db.update(transactions)
            .set({ deletedAt: new Date() })
            .where(eq(transactions.id, transactionId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
