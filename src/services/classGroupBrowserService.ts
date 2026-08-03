import type { ClassGroup, CreateClassGroup, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const classGroupBrowserService = {
  async list(size?: number) {
    const { data } = await browserApi.get<Page<ClassGroup>>("/turma", {
      params: size ? { size } : undefined,
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
