import type { Page, PageQuery, Student } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const studentService = {
  async list(query: PageQuery & { search?: string; enabled?: boolean } = {}) {
    const { data } = await browserApi.get<Page<Student>>("/alunos", {
      params: query,
    });
    return data;
  },

  async listActive(query: PageQuery = {}) {
    const { data } = await browserApi.get<Page<Student>>("/alunos/ativos", {
      params: query,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Student>(
      `/alunos/${encodeURIComponent(id)}`,
    );
    return data;
  },
};
