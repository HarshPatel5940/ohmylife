import { getDb } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const { env } = getCloudflareContext();
        const db = getDb(env);

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("clientId");
        const type = searchParams.get("type");

        // For now, return empty array as transactions table may not exist yet
        // TODO: Implement actual transactions query when schema is ready
        console.log("Transactions query:", { clientId, type });

        return NextResponse.json([]);
    } catch (error) {
        console.error("Transactions API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
