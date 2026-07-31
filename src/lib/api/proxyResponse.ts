import "server-only";

import type { AxiosResponse } from "axios";
import { NextResponse } from "next/server";

export function jsonFromUpstream(response: AxiosResponse) {
  const nextResponse = NextResponse.json(response.data ?? null, {
    status: response.status,
  });
  nextResponse.headers.set("Cache-Control", "no-store");
  return nextResponse;
}

export function binaryFromUpstream(response: AxiosResponse<ArrayBuffer>) {
  const headers = new Headers();
  const contentType = response.headers["content-type"];
  const contentDisposition = response.headers["content-disposition"];

  if (contentType) headers.set("Content-Type", String(contentType));
  if (contentDisposition) {
    headers.set("Content-Disposition", String(contentDisposition));
  }
  headers.set("Cache-Control", "no-store");

  const body =
    response.status === 204 ? null : new Uint8Array(response.data);

  return new NextResponse(body, {
    status: response.status,
    headers,
  });
}

export function upstreamUnavailableResponse() {
  return NextResponse.json(
    {
      status: 502,
      error: "UPSTREAM_UNAVAILABLE",
      message: "Não foi possível conectar à API de manutenção.",
    },
    { status: 502 },
  );
}
