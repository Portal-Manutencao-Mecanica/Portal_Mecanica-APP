import type { ClassGroup, CreateClassGroup, Page, PageQuery } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const classGroupBrowserService = {
  async list(query: (PageQuery & { search?: string; enabled?: boolean }) | number = {}) {
    const { data } = await browserApi.get<Page<ClassGroup>>("/turma", {
      params: typeof query === "number" ? { size: query } : query,
    });
    return data;
  },
  async getById(id: string) {
    const { data } = await browserApi.get<ClassGroup>(`/turma/${encodeURIComponent(id)}`);
    return data;
  },
  async create(classGroup: CreateClassGroup) {
    const { data } = await browserApi.post<ClassGroup>("/turma", classGroup);
    return data;
  },
  async update(id: string, classGroup: CreateClassGroup) {
    const { data } = await browserApi.put<ClassGroup>(
      `/turma/${encodeURIComponent(id)}`,
      classGroup,
    );
    return data;
  },
  async deactivate(id: string) {
    const { data } = await browserApi.patch<ClassGroup>(
      `/turma/${encodeURIComponent(id)}/inativar`,
    );
    return data;
  },
  async reactivate(id: string) {
    const { data } = await browserApi.patch<ClassGroup>(
      `/turma/${encodeURIComponent(id)}/reativar`,
    );
    return data;
  },
};
