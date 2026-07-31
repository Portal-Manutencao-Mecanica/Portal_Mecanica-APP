import type { LoginResponse, UserProfile } from "@/lib/api/types";
import { authApi, clearSession } from "./httpService";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VerifyCodeCredentials {
  email: string;
  code: string;
}

export interface ResetPasswordCredentials {
  token: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await authApi.post<LoginResponse>("/login", {
      ...credentials,
      email: credentials.email.trim(),
    });
    return data;
  },

  async getSession() {
    const { data } = await authApi.get<UserProfile>("/session", {
      headers: { "Cache-Control": "no-store" },
    });
    return data;
  },

  async logout() {
    const refreshToken = typeof window === "undefined"
      ? null
      : localStorage.getItem("@App:refreshToken");

    try {
      if (refreshToken) await authApi.post("/logout", { refreshToken });
    } finally {
      clearSession();
    }
  },

  async forgotPassword(email: string) {
    const { data } = await authApi.post<{ message: string }>("/password/forgot", {
      email,
    });
    return data;
  },

  async verifyCode(payload: VerifyCodeCredentials) {
    const { data } = await authApi.post<{ token: string; message?: string }>("/password/verify-code", payload);
    return data;
  },

  async resetPassword(payload: ResetPasswordCredentials) {
    const { data } = await authApi.post<{ message: string }>("/password/reset", payload);
    return data;
  },
};
