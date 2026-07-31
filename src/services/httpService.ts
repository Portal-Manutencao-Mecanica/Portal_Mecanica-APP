import axios from "axios";

import type { ApiErrorPayload } from "@/lib/api/types";

export const browserApi = axios.create({
  baseURL: "/api",
  timeout: 15_000,
});

export const authApi = axios.create({
  baseURL: "/api/auth",
  timeout: 15_000,
});

browserApi.interceptors.response.use(undefined, (error) => {
  if (
    typeof window !== "undefined" &&
    axios.isAxiosError(error) &&
    error.response?.status === 401
  ) {
    window.dispatchEvent(new Event("maintenance:unauthorized"));
  }

  return Promise.reject(error);
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
