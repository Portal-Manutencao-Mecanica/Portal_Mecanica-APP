import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE, REFRESH_COOKIE } from "@/lib/api/config";
import { clearSessionCookies, setSessionCookies } from "@/lib/api/session";
import type { UserProfile } from "@/lib/api/types";
import {
  jsonFromUpstream,
  upstreamUnavailableResponse,
} from "@/lib/api/proxyResponse";
import { refreshUpstreamSession } from "@/services/sessionService";
import { upstreamApi } from "@/services/upstreamApiService";

async function loadCurrentUser(accessToken: string) {
  return upstreamApi.get<UserProfile>("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(AUTH_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (accessToken) {
      const currentUser = await loadCurrentUser(accessToken);
      if (currentUser.status >= 200 && currentUser.status < 300) {
        return jsonFromUpstream(currentUser);
      }
      if (currentUser.status !== 401) {
        return jsonFromUpstream(currentUser);
      }
    }

    const refreshedSession = await refreshUpstreamSession(refreshToken);
    if (refreshedSession) {
      const currentUser = await loadCurrentUser(refreshedSession.accessToken);
      const response = jsonFromUpstream(currentUser);
      if (currentUser.status >= 200 && currentUser.status < 300) {
        setSessionCookies(response, refreshedSession);
      } else {
        clearSessionCookies(response);
      }
      return response;
    }

    const response = NextResponse.json(
      {
        status: 401,
        error: "AUTHENTICATION_REQUIRED",
        message: "Faça login para continuar.",
      },
      { status: 401 },
    );
    clearSessionCookies(response);
    return response;
  } catch {
    return upstreamUnavailableResponse();
  }
}
