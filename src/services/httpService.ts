import axios, { AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import type { ApiErrorPayload, LoginResponse } from "@/lib/api/types";

const ACCESS_TOKEN_KEY = "@App:accessToken";
const REFRESH_TOKEN_KEY = "@App:refreshToken";
const USER_KEY = "@App:user";
const PUBLIC_AUTH_PATHS = ["/login", "/refresh", "/password/forgot", "/password/verify-code", "/password/reset"];

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retryAfterRefresh?: boolean;
}

export const browserApi = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15_000,
});

export const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  timeout: 15_000,
});

let refreshPromise: Promise<LoginResponse> | null = null;

export function saveSession(session: LoginResponse) {
  if (typeof window === "undefined") return;

  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function addAccessToken(config: InternalAxiosRequestConfig) {
  if (typeof window === "undefined") return config;

  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) config.headers.set("Authorization", `Bearer ${accessToken}`);
  return config;
}

browserApi.interceptors.request.use(addAccessToken);

authApi.interceptors.request.use((config) => {
  return PUBLIC_AUTH_PATHS.includes(config.url ?? "") ? config : addAccessToken(config);
});

function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = typeof window === "undefined"
    ? null
    : localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) return Promise.reject(new Error("Sessão expirada."));

  refreshPromise = authApi
    .post<LoginResponse>("/refresh", { refreshToken })
    .then(({ data }) => {
      saveSession(data);
      return data;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function retryAfterRefresh(error: unknown, client: AxiosInstance) {
  if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
    return Promise.reject(error);
  }

  const originalRequest = error.config as RetryRequestConfig;
  if (originalRequest._retryAfterRefresh || (client === authApi && PUBLIC_AUTH_PATHS.includes(originalRequest.url ?? ""))) {
    return Promise.reject(error);
  }

  originalRequest._retryAfterRefresh = true;

  try {
    const session = await refreshAccessToken();
    const headers = AxiosHeaders.from(originalRequest.headers);
    headers.set("Authorization", `Bearer ${session.accessToken}`);
    originalRequest.headers = headers;
    return client(originalRequest);
  } catch (refreshError) {
    clearSession();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
    return Promise.reject(refreshError);
  }
}

browserApi.interceptors.response.use(
  (response) => response,
  (error: unknown) => retryAfterRefresh(error, browserApi),
);

authApi.interceptors.response.use(
  (response) => response,
  (error: unknown) => retryAfterRefresh(error, authApi),
);

export function getServiceErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a solicitação.",
): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
