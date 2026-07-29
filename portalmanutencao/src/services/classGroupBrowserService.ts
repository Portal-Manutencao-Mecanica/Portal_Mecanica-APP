import type { ClassGroup } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const classGroupBrowserService = {
  async getById(id: string) {
    const { data } = await browserApi.get<ClassGroup>(
      `/turma/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async updateAcronym(id: string, acronym: string) {
    const { data } = await browserApi.patch<ClassGroup>(
      `/turma/${encodeURIComponent(id)}`,
      { acronym },
    );
    return data;
  },
};
