import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is trying to access an /admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if they have the admin_session cookie
    const hasSession = request.cookies.has("admin_session");

    // If not, redirect them to the login page
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Otherwise, let them through
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to all /admin routes
  matcher: ["/admin/:path*"],
};