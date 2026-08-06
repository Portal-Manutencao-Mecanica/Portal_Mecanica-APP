import type {
  CredentialResendResponse,
  CreatedUser,
  CreateUserRequest,
  ManagedUser,
  NotificationPreferencesPatch,
  OwnUserProfile,
  Page,
  PageQuery,
  UserRole,
  UserImportResponse,
  UpdateUserRequest,
} from "@/lib/api/types";
import { browserApi } from "./httpService";

export const userService = {
  async getOwnProfile() {
    const { data } = await browserApi.get<OwnUserProfile>("/users/me");
    return data;
  },
  async list(query: PageQuery & {
    search?: string;
    role?: UserRole;
    enabled?: boolean;
  } = {}) {
    const { data } = await browserApi.get<Page<ManagedUser>>("/users", {
      params: query,
    });
    return data;
  },
  async getById(id: string) {
    const { data } = await browserApi.get<ManagedUser>(
      `/users/${encodeURIComponent(id)}`,
    );
    return data;
  },
  async create(payload: CreateUserRequest) {
    const { data } = await browserApi.post<CreatedUser>("/users", payload);
    return data;
  },
  async importCsv(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await browserApi.post<UserImportResponse>(
      "/users/import",
      formData,
    );
    return data;
  },
  async updateOwnProfile(name: string) {
    const { data } = await browserApi.patch<OwnUserProfile>("/users/me", { name });
    return data;
  },
  async updateNotificationPreferences(payload: NotificationPreferencesPatch) {
    const { data } = await browserApi.patch<OwnUserProfile>(
      "/users/me/preferences",
      payload,
    );
    return data;
  },
  async update(id: string, payload: UpdateUserRequest) {
    const { data } = await browserApi.put<ManagedUser>(
      `/users/${encodeURIComponent(id)}`,
      payload,
    );
    return data;
  },
  async deactivate(id: string, reason = "Inativação realizada pelo gerenciamento de usuários.") {
    const { data } = await browserApi.patch<ManagedUser>(
      `/users/${encodeURIComponent(id)}/deactivate`,
      { reason },
    );
    return data;
  },
  async reactivate(id: string, reason = "Reativação realizada pelo gerenciamento de usuários.") {
    const { data } = await browserApi.patch<ManagedUser>(
      `/users/${encodeURIComponent(id)}/reactivate`,
      { reason },
    );
    return data;
  },
  async block(id: string, reason = "Bloqueio realizado pelo gerenciamento de usuários.") {
    const { data } = await browserApi.patch<ManagedUser>(
      `/users/${encodeURIComponent(id)}/block`,
      { reason },
    );
    return data;
  },
  async unblock(id: string, reason = "Desbloqueio realizado pelo gerenciamento de usuários.") {
    const { data } = await browserApi.patch<ManagedUser>(
      `/users/${encodeURIComponent(id)}/unblock`,
      { reason },
    );
    return data;
  },
  async changeRole(id: string, role: UserRole) {
    const { data } = await browserApi.patch<ManagedUser>(
      `/users/${encodeURIComponent(id)}/role`,
      { role },
    );
    return data;
  },
  async resetPassword(id: string) {
    const { data } = await browserApi.post<CredentialResendResponse>(
      `/users/${encodeURIComponent(id)}/resend-credentials`,
    );
    return data;
  },
};
