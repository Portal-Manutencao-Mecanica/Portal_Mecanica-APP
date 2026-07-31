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
