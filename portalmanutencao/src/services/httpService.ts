import axios, { AxiosError } from "axios";

import type { ApiErrorPayload } from "@/lib/api/types";

export const browserApi = axios.create({
  baseURL: "/api/backend",
  timeout: 15_000,
});

export const authApi = axios.create({
  baseURL: "/api/auth",
  timeout: 15_000,
});

export function getServiceErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a solicitação.",
) {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    return payload?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
