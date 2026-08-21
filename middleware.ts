import { NextRequest, NextResponse } from "next/server";

// ─── Protected Routes Config ──────────────────────
const PROTECTED_ROUTES = [
  "/dashboard",
  "/add-product",
  "/my-products",
  "/my-orders",
  "/profile",
  "/messages",
  "/checkout",
];

const SELLER_ONLY_ROUTES = ["/add-product", "/my-products"];

const ADMIN_ONLY_ROUTES = ["/admin"];

const AUTH_ROUTES = ["/login", "/register"];

// ─── Middleware ───────────────────────────────────
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;
  const isLoggedIn = !!token;

  // ── Redirect logged-in users away from auth pages ──
  if (isLoggedIn && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── Protect private routes ──
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Admin routes ──
  if (ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Role check happens in the page/layout via useAuth
  }

  return NextResponse.next();
}

// ─── Config ───────────────────────────────────────
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - API routes (/api/...)
     * - Next.js internals (_next/...)
     * - Static files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
