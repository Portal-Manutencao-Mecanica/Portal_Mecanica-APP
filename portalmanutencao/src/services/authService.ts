import type { LoginResponse, UserProfile } from "@/lib/api/types";
import { authApi } from "./httpService";

export interface LoginCredentials {
  email: string;
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
    await authApi.post("/logout");
  },

  async forgotPassword(email: string) {
    const { data } = await authApi.post<{ message: string }>("/password/forgot", {
      email,
    });
    return data;
  },
};
