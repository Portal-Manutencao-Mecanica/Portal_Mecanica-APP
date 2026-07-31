import type { AuthSession, UserProfile } from "@/lib/api/types";
import { authApi, browserApi } from "./httpService";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await authApi.post<AuthSession>("/login", {
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

  async changePassword(payload: ChangePasswordCredentials) {
    await browserApi.patch("/users/me/password", payload);
  },

  async forgotPassword(email: string) {
    const { data } = await authApi.post<{ message: string }>("/password/forgot", {
      email,
    });
    return data;
  },

  async validateResetToken(token: string) {
    const { data } = await authApi.get<{ valid: boolean }>("/password/validate", {
      params: { token },
    });
    return data.valid;
  },

  async resetPassword(payload: ResetPasswordCredentials) {
    const { data } = await authApi.post<{ message: string }>("/password/reset", payload);
    return data;
  },
};
