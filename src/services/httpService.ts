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

browserApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("@App:accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

authApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("@App:accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }
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