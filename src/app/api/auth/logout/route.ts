import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIE, REFRESH_COOKIE } from "@/lib/api/config";
import { clearSessionCookies } from "@/lib/api/session";
import { upstreamApi } from "@/services/upstreamApiService";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (accessToken && refreshToken) {
    try {
      await upstreamApi.post(
        "/auth/logout",
        { refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch {
      // A sessão local deve ser encerrada mesmo se a API estiver indisponível.
    }
  }

  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response);
  return response;
}
