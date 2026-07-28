import "server-only";

import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  REFRESH_COOKIE,
  sessionCookieOptions,
} from "./config";
import type { LoginResponse } from "./types";

export function setSessionCookies(
  response: NextResponse,
  session: LoginResponse,
) {
  response.cookies.set(AUTH_COOKIE, session.accessToken, {
    ...sessionCookieOptions,
    maxAge: session.expiresIn,
  });
  response.cookies.set(REFRESH_COOKIE, session.refreshToken, {
    ...sessionCookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });
  response.cookies.set(REFRESH_COOKIE, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });
}
