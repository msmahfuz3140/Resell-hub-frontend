import { NextRequest, NextResponse } from "next/server";

// ─── Middleware ───────────────────────────────────
// Auth protection is handled client-side by ProtectedRoute component.
// This middleware only handles basic rewrites/headers if needed.
export function middleware(req: NextRequest) {
  // Check both cookie names for auth token
  const token =
    req.cookies.get("accessToken")?.value ||
    req.cookies.get("resellhub_token")?.value;

  const { pathname } = req.nextUrl;

  // If user has a cookie token and tries to visit /login or /register,
  // redirect them to dashboard
  if (
    token &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // All other auth checks happen client-side via ProtectedRoute
  return NextResponse.next();
}

// ─── Config ───────────────────────────────────────
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
