import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE, getApiUrl, REFRESH_COOKIE } from "@/lib/api/config";
import { clearSessionCookies, setSessionCookies } from "@/lib/api/session";
import { upstreamUnavailableResponse } from "@/lib/api/proxyResponse";
import type { LoginResponse } from "@/lib/api/types";
import { refreshUpstreamSession } from "@/services/sessionService";

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

  const url =
    `${getApiUrl()}/${path.map(encodeURIComponent).join("/")}` +
    request.nextUrl.search;

  return fetch(url, {
    method,
    headers,
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : requestBody,
    cache: "no-store",
  });
}

async function responseFromUpstream(upstreamResponse: Response) {
  const headers = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");
  const contentDisposition = upstreamResponse.headers.get(
    "content-disposition",
  );

  if (contentType) headers.set("Content-Type", contentType);
  if (contentDisposition) {
    headers.set("Content-Disposition", contentDisposition);
  }
  headers.set("Cache-Control", "no-store");

  const body =
    upstreamResponse.status === 204
      ? null
      : await upstreamResponse.arrayBuffer();

  return new NextResponse(body, {
    status: upstreamResponse.status,
    headers,
  });
}

async function handle(request: NextRequest, context: RouteContext) {
  try {
    const { path } = await context.params;
    const accessToken = request.cookies.get(AUTH_COOKIE)?.value;
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
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

    const response = await responseFromUpstream(upstreamResponse);

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
