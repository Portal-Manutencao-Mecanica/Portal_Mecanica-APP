import "server-only";

import { cookies } from "next/headers";

import { REFRESH_COOKIE } from "@/lib/api/config";
import type { LoginResponse } from "@/lib/api/types";
import { upstreamApi } from "./upstreamApiService";

export async function refreshUpstreamSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) return null;

  const response = await upstreamApi.post<LoginResponse>("/auth/refresh", {
    refreshToken,
  });

  return response.status >= 200 && response.status < 300 ? response.data : null;
}
