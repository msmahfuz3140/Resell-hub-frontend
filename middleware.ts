import { NextRequest, NextResponse } from "next/server";

// ─── Middleware ───────────────────────────────────
// Auth protection is handled client-side by ProtectedRoute component.
// Middleware passes requests through without blocking login/register navigation.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// ─── Config ───────────────────────────────────────
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
