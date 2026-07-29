import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/api/config";
import { setSessionCookies } from "@/lib/api/session";
import { refreshUpstreamSession } from "@/services/sessionService";
import { upstreamApi } from "@/services/upstreamApiService";

const SUPPORTED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {https://github.com/Portal-Manutencao-Mecanica/Manutencao-API.git
  if (!SUPPORTED_METHODS.has(request.method)) {
    return NextResponse.json({ message: "Método não permitido." }, { status: 405 });
  }

  const { path } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Sessão não encontrada." }, { status: 401 });
  }

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const requestBody = hasBody ? await request.arrayBuffer() : undefined;
  const sendUpstreamRequest = (token: string) =>
    upstreamApi.request<ArrayBuffer>({
      url: `/${path.join("/")}${request.nextUrl.search}`,
      method: request.method,
      headers: {
        ...Object.fromEntries(headers.entries()),
        Authorization: `Bearer ${token}`,
      },
      data: requestBody,
      responseType: "arraybuffer",
    });

  let upstream = await sendUpstreamRequest(accessToken);
  let refreshedSession = null;

  if (upstream.status === 401) {
    refreshedSession = await refreshUpstreamSession();
    if (refreshedSession) {
      upstream = await sendUpstreamRequest(refreshedSession.accessToken);
    }
  }

  const response = new NextResponse(upstream.data, {
    status: upstream.status,
    headers: {
      "Content-Type": String(upstream.headers["content-type"] ?? "application/json"),
    },
  });
  if (refreshedSession) setSessionCookies(response, refreshedSession);
  return response;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
