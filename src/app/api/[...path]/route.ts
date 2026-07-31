import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { AUTH_COOKIE, REFRESH_COOKIE } from "@/lib/api/config";
import { clearSessionCookies, setSessionCookies } from "@/lib/api/session";
import { binaryFromUpstream, upstreamUnavailableResponse } from "@/lib/api/proxyResponse";
import type { LoginResponse } from "@/lib/api/types";
import { refreshUpstreamSession } from "@/services/sessionService";
import { upstreamApi } from "@/services/upstreamApiService";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function forward(
  request: NextRequest,
  path: string[],
  accessToken?: string,
  requestBody?: ArrayBuffer,
) {
  const method = request.method.toUpperCase();
  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) headers["Content-Type"] = contentType;
  if (accept) headers.Accept = accept;
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  headers["User-Agent"] =
    request.headers.get("user-agent") ?? "maintenance-web";
  headers["X-Forwarded-For"] =
    request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const config: AxiosRequestConfig<ArrayBuffer> = {
    url: `/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`,
    method,
    headers,
    responseType: "arraybuffer",
  };

  if (method !== "GET" && method !== "HEAD") {
    config.data = requestBody;
  }

  return upstreamApi.request<ArrayBuffer>(config);
}

async function handle(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(AUTH_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
    const requestBody =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    let upstreamResponse = await forward(
      request,
      path,
      accessToken,
      requestBody,
    );
    let refreshedSession: LoginResponse | null = null;

    if (upstreamResponse.status === 401 && refreshToken) {
      refreshedSession = await refreshUpstreamSession(refreshToken);
      if (refreshedSession) {
        upstreamResponse = await forward(
          request,
          path,
          refreshedSession.accessToken,
          requestBody,
        );
      }
    }

    const response = binaryFromUpstream(
      upstreamResponse as AxiosResponse<ArrayBuffer>,
    );

    if (refreshedSession) {
      setSessionCookies(response, refreshedSession);
    } else if (upstreamResponse.status === 401) {
      clearSessionCookies(response);
    }

    return response;
  } catch {
    return upstreamUnavailableResponse();
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
