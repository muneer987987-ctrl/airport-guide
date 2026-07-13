import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight presence check only (Edge middleware can't easily verify jose
// JWTs against all runtimes here) — the real signature check happens again
// in each admin server component/action via getAdminSession(). This just
// keeps unauthenticated users from loading the admin shell at all.
export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const hasSession = request.cookies.has("admin_session");

  if (!isLoginPage && !hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
