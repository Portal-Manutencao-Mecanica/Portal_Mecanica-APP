import { NextResponse } from "next/server";

import { upstreamApi } from "@/services/upstreamApiService";

export async function POST(request: Request) {
  const upstream = await upstreamApi.post(
    "/auth/password/forgot",
    await request.json(),
  );
  return NextResponse.json(upstream.data, { status: upstream.status });
}
