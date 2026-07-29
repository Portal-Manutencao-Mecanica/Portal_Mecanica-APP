import type { Teacher } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const teacherService = {
  async list() {
    const { data } = await browserApi.get<Teacher[]>("/professores");
    return data;
  },
};