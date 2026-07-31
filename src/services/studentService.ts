import type { Student } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const studentService = {
  async list() {
    const { data } = await browserApi.get<Student[]>("/alunos");
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Student>(
      `/alunos/${encodeURIComponent(id)}`,
    );
    return data;
  },
};
