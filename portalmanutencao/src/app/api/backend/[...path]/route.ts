import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE } from '@/lib/api/config';
import { setSessionCookies } from '@/lib/api/session';
import { refreshUpstreamSession } from '@/services/sessionService';
import { upstreamApi } from '@/services/upstreamApiService';

const SUPPORTED_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!SUPPORTED_METHODS.has(request.method)) {
    return NextResponse.json({ message: 'M\u00e9todo n\u00e3o permitido.' }, { status: 405 });
  }

  const { path } = await context.params;
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(AUTH_COOKIE)?.value;
  let refreshedSession = null;

  if (!accessToken) {
    refreshedSession = await refreshUpstreamSession();
    accessToken = refreshedSession?.accessToken;
    if (!accessToken) {
      return NextResponse.json({ message: 'Sess\u00e3o n\u00e3o encontrada.' }, { status: 401 });
    }
  }

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${accessToken}`);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const requestBody = hasBody ? await request.arrayBuffer() : undefined;
  const sendUpstreamRequest = (token: string) =>
    upstreamApi.request<ArrayBuffer>({
      url: `/${path.join('/')}${request.nextUrl.search}`,
      method: request.method,
      headers: {
        ...Object.fromEntries(headers.entries()),
        Authorization: `Bearer ${token}`,
      },
      data: requestBody,
      responseType: 'arraybuffer',
    });

  let upstream = await sendUpstreamRequest(accessToken);

  if (upstream.status === 401 && !refreshedSession) {
    refreshedSession = await refreshUpstreamSession();
    if (refreshedSession) {
      upstream = await sendUpstreamRequest(refreshedSession.accessToken);
    }
  }

  const response = new NextResponse(upstream.data, {
    status: upstream.status,
    headers: {
      'Content-Type': String(upstream.headers['content-type'] ?? 'application/json'),
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
