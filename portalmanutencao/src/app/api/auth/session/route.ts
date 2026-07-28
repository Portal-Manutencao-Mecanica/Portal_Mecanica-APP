import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { AUTH_COOKIE } from "@/lib/api/config";
import { setSessionCookies } from "@/lib/api/session";
import { refreshUpstreamSession } from "@/services/sessionService";
import { upstreamApi } from "@/services/upstreamApiService";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE)?.value;

  let refreshedSession = null;
  if (!accessToken) {
    refreshedSession = await refreshUpstreamSession();
    if (!refreshedSession) {
      return NextResponse.json({ message: "Sessão não encontrada." }, { status: 401 });
    }
  }

  let activeToken = refreshedSession?.accessToken ?? accessToken;
  let upstream = await upstreamApi.get("/auth/me", {
    headers: { Authorization: `Bearer ${activeToken}` },
  });

  if (upstream.status === 401 && !refreshedSession) {
    refreshedSession = await refreshUpstreamSession();
    if (refreshedSession) {
      activeToken = refreshedSession.accessToken;
      upstream = await upstreamApi.get("/auth/me", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
    }
  }

  const response = NextResponse.json(upstream.data, { status: upstream.status });
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}
