import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE, REFRESH_COOKIE } from "@/lib/api/config";
import {
  jsonFromUpstream,
  upstreamUnavailableResponse,
} from "@/lib/api/proxyResponse";
import { clearSessionCookies } from "@/lib/api/session";
import { refreshUpstreamSession } from "@/services/sessionService";
import { upstreamApi } from "@/services/upstreamApiService";

async function revokeAll(accessToken: string) {
  return upstreamApi.post(
    "/auth/logout-all",
    undefined,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(AUTH_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!accessToken && refreshToken) {
      accessToken = (await refreshUpstreamSession(refreshToken))?.accessToken;
    }

    if (!accessToken) {
      const response = new NextResponse(null, { status: 204 });
      clearSessionCookies(response);
      return response;
    }

    let upstreamResponse = await revokeAll(accessToken);
    if (upstreamResponse.status === 401 && refreshToken) {
      const refreshedSession = await refreshUpstreamSession(refreshToken);
      if (refreshedSession) {
        upstreamResponse = await revokeAll(refreshedSession.accessToken);
      }
    }

    if (upstreamResponse.status < 200 || upstreamResponse.status >= 300) {
      return jsonFromUpstream(upstreamResponse);
    }

    const response = new NextResponse(null, { status: 204 });
    clearSessionCookies(response);
    return response;
  } catch {
    return upstreamUnavailableResponse();
  }
}
