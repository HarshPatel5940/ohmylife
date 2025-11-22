import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;


    if (path.startsWith("/dashboard")) {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (path.startsWith("/dashboard/leads") && !payload.canAccessLeads && payload.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if (path.startsWith("/dashboard/sales") && !payload.canAccessFinance && payload.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        const projectMatch = path.match(/^\/dashboard\/projects\/(\d+)/);
        if (projectMatch && payload.role !== "admin") {
            const requestedProjectId = parseInt(projectMatch[1]);
            if (payload.projectId !== requestedProjectId) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
