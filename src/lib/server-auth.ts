import { getDb } from "@/lib/db";
import { users, people } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { deserializePermissions, type UserPermissions } from "@/lib/permissions";
/**
 * Get user from request headers (set by middleware)
 * This is the preferred method for API routes as it avoids database queries
 */
export function getUserFromHeaders(request: Request): UserPermissions | null {
  const permissionsHeader = request.headers.get("x-user-permissions");
  if (!permissionsHeader) return null;

  return deserializePermissions(permissionsHeader);
}

/**
 * Require admin role - throws 403 if not admin
 * Use this in API routes that require admin access
 */
export function requireAdmin(request: Request): UserPermissions {
  const user = getUserFromHeaders(request);

  if (!user || user.role !== "admin") {
    throw new Response(
      JSON.stringify({ error: "Forbidden - Admin access required" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return user;
}

/**
 * Require specific permission - throws 403 if user lacks permission
 */
export function requirePermission(
  request: Request,
  check: (user: UserPermissions) => boolean
): UserPermissions {
  const user = getUserFromHeaders(request);

  if (!user) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!check(user)) {
    throw new Response(
      JSON.stringify({ error: "Forbidden - Insufficient permissions" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return user;
}

/**
 * Get authenticated user from database (legacy method)
 * Use getUserFromHeaders() in API routes instead for better performance
 * This is kept for non-API route usage
 */
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
