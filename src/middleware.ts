import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const authPages = ["/register", "/login"];
    const protectedRoutes = ["/dashboard", "/profile"];

    const pathname = req.nextUrl.pathname;

    const accessToken = req.cookies.get("accessToken")?.value;

    if (
        !accessToken &&
        protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (accessToken && authPages.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Public routes → continue
    return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"], // protected routes
};
