import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

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

export function getApiErrorStatus(error: unknown) {
  return axios.isAxiosError<ApiErrorPayload>(error)
    ? error.response?.status
    : undefined;
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) return {};

  const errors = error.response?.data?.errors;
  if (!errors) return {};

  return Object.fromEntries(
    Object.entries(errors).filter(
      ([field, message]) =>
        field.trim().length > 0 && typeof message === "string" && message.trim().length > 0,
    ),
  );
}

export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  const fieldErrors = getApiFieldErrors(error);

  for (const [field, message] of Object.entries(fieldErrors)) {
    const normalizedField = field.replace(/\[(\d+)\]/g, ".$1");
    setError(normalizedField as Path<T>, { type: "server", message });
  }

  return Object.keys(fieldErrors).length > 0;
}

function retryAfterMessage(error: unknown) {
  if (!axios.isAxiosError(error)) return null;

  const retryAfter = error.response?.headers["retry-after"];
  const rawValue = Array.isArray(retryAfter) ? retryAfter[0] : retryAfter;
  const seconds = Number(rawValue);

  return Number.isFinite(seconds) && seconds > 0
    ? ` Aguarde ${Math.ceil(seconds)} segundo${seconds > 1 ? "s" : ""} antes de tentar novamente.`
    : " Aguarde alguns instantes antes de tentar novamente.";
}

function dispatchApiError(status: number) {
  if (typeof window === "undefined") return;

  const eventName = {
    401: "maintenance:unauthorized",
    403: "maintenance:forbidden",
    404: "maintenance:not-found",
    500: "maintenance:internal-error",
    502: "maintenance:upstream-unavailable",
    503: "maintenance:upstream-unavailable",
    504: "maintenance:upstream-unavailable",
  }[status];

  if (eventName) window.dispatchEvent(new Event(eventName));
}

function handleNavigationError(error: unknown) {
  const status = getApiErrorStatus(error);
  if (!status) return;

  const method = axios.isAxiosError(error)
    ? error.config?.method?.toUpperCase()
    : undefined;
  const isReadRequest = !method || method === "GET" || method === "HEAD";

  if (status === 401 || status === 403 || status === 404) {
    dispatchApiError(status);
  } else if (isReadRequest && [500, 502, 503, 504].includes(status)) {
    dispatchApiError(status);
  }
}

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

browserApi.interceptors.response.use(
  (response) => response,
  (error) => {
    handleNavigationError(error);
    return Promise.reject(error);
  },
);

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.config?.url === "/session") {
      handleNavigationError(error);
    }
    return Promise.reject(error);
  },
);

export function getServiceErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a solicitação.",
): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const status = error.response?.status;
    const apiMessage = error.response?.data?.message?.trim();

    if (!status) {
      return error.code === "ECONNABORTED"
        ? "A conexão com a API demorou demais. Verifique sua conexão e tente novamente."
        : "Não foi possível conectar à API. Verifique sua conexão e tente novamente.";
    }

    if (status === 413) {
      return "O arquivo enviado excede o tamanho máximo aceito. Revise o limite e tente novamente.";
    }
    if (status === 415) {
      return apiMessage ?? "Tipo de arquivo não permitido. Use um dos formatos aceitos.";
    }
    if (status === 429) {
      return `${apiMessage ?? "Muitas tentativas ou requisições."}${retryAfterMessage(error) ?? ""}`;
    }
    if (status === 500) {
      return "Ocorreu um erro interno. Tente novamente em instantes.";
    }
    if ([502, 503, 504].includes(status)) {
      return "A API está temporariamente indisponível. Tente novamente em instantes.";
    }

    return apiMessage ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
