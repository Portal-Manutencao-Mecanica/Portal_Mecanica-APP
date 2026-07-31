import { NextRequest, NextResponse } from "next/server";

import { setSessionCookies } from "@/lib/api/session";
import type { AuthSession, LoginResponse } from "@/lib/api/types";
import {
  jsonFromUpstream,
  upstreamUnavailableResponse,
} from "@/lib/api/proxyResponse";
import { upstreamApi } from "@/services/upstreamApiService";

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();
    const upstreamResponse = await upstreamApi.post<LoginResponse>(
      "/auth/login",
      credentials,
      {
        headers: {
          "User-Agent": request.headers.get("user-agent") ?? "maintenance-web",
          "X-Forwarded-For":
            request.headers.get("x-forwarded-for") ?? "127.0.0.1",
        },
      },
    );

    if (upstreamResponse.status < 200 || upstreamResponse.status >= 300) {
      return jsonFromUpstream(upstreamResponse);
    }

    const session = upstreamResponse.data;
    const browserSession: AuthSession = {
      expiresIn: session.expiresIn,
      passwordChangeRequired: session.passwordChangeRequired,
      user: session.user,
    };
    const response = NextResponse.json(browserSession);
    response.headers.set("Cache-Control", "no-store");
    setSessionCookies(response, session);
    return response;
  } catch {
    return upstreamUnavailableResponse();
  }
}
