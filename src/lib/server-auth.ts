import { getDb } from "@/lib/db";
import { users, people } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function getAuthenticatedUser(env: any) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return null;

        const payload = await verifyToken(token);
        if (!payload) return null;

        const db = getDb(env);


        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
            with: {
                person: true
            }
        });

        if (!user) return null;

        return {
            ...user,
            projectId: (user.person as any)?.projectId
        };
    } catch (error) {
        console.error("getAuthenticatedUser error:", error);
        return null;
    }
}
