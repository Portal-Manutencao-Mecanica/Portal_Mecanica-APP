import type { LoginResponse, UserProfile } from "@/lib/api/types";
import { authApi } from "./httpService";

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

export interface FirstAccessParams {
  email: string;
}

export interface CompleteFirstAccessParams {
  email: string;
  temporaryPassword: string;
  newPassword: string;
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
    await authApi.post("/logout");
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

  async requestFirstAccess(payload: FirstAccessParams) {
    const { data } = await authApi.post<{ message: string }>("/auth/first-access", payload);
    return data;
  },

  async completeFirstAccess(payload: CompleteFirstAccessParams) {
    const { data } = await authApi.post<{ message: string }>("/auth/first-access/complete", payload);
    return data;
  },
};