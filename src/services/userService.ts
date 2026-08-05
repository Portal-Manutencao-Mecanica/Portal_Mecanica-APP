import type {
  CreatedUser,
  CreateUserRequest,
  UserProfile,
  UserImportResponse,
  UpdateUserRequest,
} from "@/lib/api/types";
import { browserApi } from "./httpService";

export const userService = {
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
    const { data } = await browserApi.patch<UserProfile>("/users/me", { name });
    return data;
  },
  async update(id: string, payload: UpdateUserRequest) {
    await browserApi.put(`/users/${encodeURIComponent(id)}`, payload);
  },
  async deactivate(id: string) {
    await browserApi.patch(`/users/${encodeURIComponent(id)}/deactivate`, {
      reason: "Inativação realizada pelo gerenciamento de usuários.",
    });
  },
  async reactivate(id: string) {
    await browserApi.patch(`/users/${encodeURIComponent(id)}/reactivate`, {
      reason: "Reativação realizada pelo gerenciamento de usuários.",
    });
  },
};
