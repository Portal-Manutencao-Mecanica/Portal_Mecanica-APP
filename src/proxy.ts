import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE, REFRESH_COOKIE } from "@/lib/api/config";

const PUBLIC_PATHS = ["/login", "/password-reset"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublicPath) return NextResponse.next();

  const hasSession =
    request.cookies.has(AUTH_COOKIE) || request.cookies.has(REFRESH_COOKIE);

  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  if (pathname !== "/") {
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
