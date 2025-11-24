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

    const cacheKey = `session:${token}`;
    const cachedUser = await env.KV?.get(cacheKey, "json");

    if (cachedUser) {
      const db = getDb(env);
      const freshUser = await db.query.users.findFirst({
        where: eq(users.id, cachedUser.id),
      });

      if (freshUser?.passwordChangedAt) {
        const cachedPasswordChange = cachedUser.passwordChangedAt
          ? new Date(cachedUser.passwordChangedAt).getTime()
          : 0;
        const actualPasswordChange = new Date(freshUser.passwordChangedAt).getTime();

        if (actualPasswordChange > cachedPasswordChange) {
          await env.KV?.delete(cacheKey);
          return null;
        }
      }

      return cachedUser;
    }

    const payload = await verifyToken(token);
    if (!payload) return null;

    const db = getDb(env);

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
      with: {
        person: true,
      },
    });

    if (!user) return null;

    if (user.passwordChangedAt && payload.iat) {
      const tokenIssuedAt = payload.iat * 1000;
      const passwordChangedAt = new Date(user.passwordChangedAt).getTime();

      if (passwordChangedAt > tokenIssuedAt) {
        return null;
      }
    }

    const userWithProject = {
      ...user,
      projectId: (user.person as any)?.projectId,
    };

    if (env.KV) {
      await env.KV.put(cacheKey, JSON.stringify(userWithProject), {
        expirationTtl: 3600,
      });
    }

    return userWithProject;
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    return null;
  }
}

export async function isAdmin(env: any): Promise<boolean> {
  const user = await getAuthenticatedUser(env);
  return user?.role === "admin";
}

export async function isAuthenticated(env: any): Promise<boolean> {
  const user = await getAuthenticatedUser(env);
  return user !== null;
}

/**
 * Invalidate a user's session cache
 * Call this on logout or password change
 */
export async function invalidateSession(env: any, token: string) {
  try {
    const cacheKey = `session:${token}`;
    await env.KV?.delete(cacheKey);
  } catch (error) {
    console.error("invalidateSession error:", error);
  }
}
