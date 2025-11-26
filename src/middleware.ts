import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { serializePermissions } from "@/lib/permissions";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Handle dashboard and API routes
  if (path.startsWith("/dashboard") || path.startsWith("/api")) {
    const token = request.cookies.get("token")?.value;

    // Redirect to login if no token (dashboard only)
    if (path.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify token and add user context to headers
    if (token) {
      const payload = await verifyToken(token);

      if (!payload) {
        // Invalid token - redirect to login for dashboard, return 401 for API
        if (path.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Add user context to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.id.toString());
      requestHeaders.set("x-user-role", payload.role);
      requestHeaders.set("x-user-permissions", serializePermissions({
        id: payload.id,
        username: payload.username,
        role: payload.role,
        canAccessLeads: payload.canAccessLeads || false,
        canAccessFinance: payload.canAccessFinance || false,
        projectId: payload.projectId,
      }));

      // Dashboard route protection
      if (path.startsWith("/dashboard")) {
        // Redirect non-admins from main dashboard to projects
        if (path === "/dashboard" && payload.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard/projects", request.url));
        }

        // Protect leads page
        if (
          path.startsWith("/dashboard/leads") &&
          !payload.canAccessLeads &&
          payload.role !== "admin"
        ) {
          return NextResponse.redirect(new URL("/dashboard/projects", request.url));
        }

        // Protect finance page
        if (
          path.startsWith("/dashboard/finance") &&
          !payload.canAccessFinance &&
          payload.role !== "admin"
        ) {
          return NextResponse.redirect(new URL("/dashboard/projects", request.url));
        }

        // Protect admin page
        if (path.startsWith("/dashboard/admin") && payload.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard/projects", request.url));
        }

        // Protect people page
        if (path.startsWith("/dashboard/people") && payload.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard/projects", request.url));
        }

        // Protect specific project access for non-admins
        const projectMatch = path.match(/^\/dashboard\/projects\/(\d+)/);
        if (projectMatch && payload.role !== "admin") {
          const requestedProjectId = parseInt(projectMatch[1]);
          if (payload.projectId !== requestedProjectId) {
            return NextResponse.redirect(new URL("/dashboard/projects", request.url));
          }
        }
      }

      // Continue with modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};

