import "server-only";

import { cookies } from "next/headers";

import { REFRESH_COOKIE } from "@/lib/api/config";
import type { LoginResponse } from "@/lib/api/types";
import { upstreamApi } from "./upstreamApiService";

const pendingRefreshes = new Map<string, Promise<LoginResponse | null>>();

export async function refreshUpstreamSession(providedRefreshToken?: string) {
  const cookieStore = await cookies();
  const refreshToken =
    providedRefreshToken ?? cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) return null;

  const pending = pendingRefreshes.get(refreshToken);
  if (pending) return pending;

  const refresh = upstreamApi
    .post<LoginResponse>("/auth/refresh", { refreshToken })
    .then((response) =>
      response.status >= 200 && response.status < 300 ? response.data : null,
    )
    .catch(() => null)
    .finally(() => pendingRefreshes.delete(refreshToken));

  pendingRefreshes.set(refreshToken, refresh);

  return refresh;
}
