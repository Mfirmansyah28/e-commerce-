import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware ini sengaja dibuat RINGAN (tanpa import Auth.js)
// supaya tidak melebihi batas 1MB Edge Function di Vercel free plan.
// Proteksi route admin yang sebenarnya tetap ada di masing-masing
// page server component (src/app/admin/layout.tsx) menggunakan auth() dari Auth.js.

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
