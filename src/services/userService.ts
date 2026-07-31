import type {
  CreatedUser,
  CreateUserRequest,
  UserImportResponse,
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
};
