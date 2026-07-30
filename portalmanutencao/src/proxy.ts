import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE, REFRESH_COOKIE } from '@/lib/api/config';

const PUBLIC_PATHS = ['/login', '/login/forgot-password'];
const DEFAULT_AUTHENTICATED_PATH = '/perfil';

function loginUrl(request: NextRequest, redirectPath: string) {
  const url = new URL('/login', request.url);
  url.searchParams.set('redirect', redirectPath);
  return url;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(
      loginUrl(request, DEFAULT_AUTHENTICATED_PATH),
    );
  }

  if (pathname === '/login' && !request.nextUrl.searchParams.has('redirect')) {
    return NextResponse.redirect(
      loginUrl(request, DEFAULT_AUTHENTICATED_PATH),
    );
  }

  const hasSession =
    request.cookies.has(AUTH_COOKIE) || request.cookies.has(REFRESH_COOKIE);
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!hasSession && !isPublicPath) {
    return NextResponse.redirect(loginUrl(request, `${pathname}${search}`));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|brand).*)'],
};
