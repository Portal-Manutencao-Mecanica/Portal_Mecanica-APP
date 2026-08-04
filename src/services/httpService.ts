import axios from "axios";

import { getIdempotencyKey } from "@/lib/api/idempotency";
import type { ApiErrorPayload } from "@/lib/api/types";

export const browserApi = axios.create({
  baseURL: "/backend",
  timeout: 15_000,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: "/api/auth",
  timeout: 15_000,
  withCredentials: true,
});

browserApi.interceptors.request.use((config) => {
  if (config.method?.toUpperCase() !== "POST") return config;

  const idempotencyKey = getIdempotencyKey(
    config.url ?? "",
    config.params,
    config.data,
  );
  config.headers.set("Idempotency-Key", idempotencyKey);
  return config;
});

export function getServiceErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a solicitação.",
): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
