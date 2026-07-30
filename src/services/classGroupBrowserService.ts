import type { ClassGroup, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const classGroupBrowserService = {
  async list() {
    const { data } = await browserApi.get<Page<ClassGroup>>("/turma");
    return data;
  },
  async getById(id: string) {
    const { data } = await browserApi.get<ClassGroup>(`/turma/${encodeURIComponent(id)}`);
    return data;
  },
  async updateAcronym(id: string, acronym: string) {
    const { data } = await browserApi.patch<ClassGroup>(`/turma/${encodeURIComponent(id)}`, { acronym });
    return data;
  },
};