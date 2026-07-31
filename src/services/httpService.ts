import axios from "axios";

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

export function getServiceErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a solicitação.",
): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
