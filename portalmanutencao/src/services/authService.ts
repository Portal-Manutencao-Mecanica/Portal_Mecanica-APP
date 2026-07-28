import type { LoginResponse, UserProfile } from "@/lib/api/types";
import { authApi } from "./httpService";

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const email =
      process.env.NODE_ENV === "development" &&
      credentials.email.trim().toLowerCase() === "user"
        ? "admin@local.com"
        : credentials.email.trim();
    const { data } = await authApi.post<LoginResponse>("/login", {
      ...credentials,
      email,
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
};
