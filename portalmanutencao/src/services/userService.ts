import type { CreatedUser, CreateUserRequest } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const userService = {
  async create(payload: CreateUserRequest) {
    const { data } = await browserApi.post<CreatedUser>("/users", payload);
    return data;
  },
};