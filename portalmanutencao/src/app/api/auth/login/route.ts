import { NextResponse } from "next/server";

import { setSessionCookies } from "@/lib/api/session";
import type { LoginResponse } from "@/lib/api/types";
import { upstreamApi } from "@/services/upstreamApiService";

export async function POST(request: Request) {
  const upstream = await upstreamApi.post<LoginResponse | object>(
    "/auth/login",
    await request.json(),
    { headers: { "Content-Type": "application/json" } },
  );
  const response = NextResponse.json(upstream.data, {
    status: upstream.status,
  });

  if (upstream.status >= 200 && upstream.status < 300) {
    setSessionCookies(response, upstream.data as LoginResponse);
  }

  return response;
}
