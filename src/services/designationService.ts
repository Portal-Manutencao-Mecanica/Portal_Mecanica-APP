import type { Designation, Page, PageQuery, Sector } from "@/lib/api/types";

import { browserApi } from "./httpService";

export const designationService = {
  async list(query: PageQuery = {}) {
    const { data } = await browserApi.get<Page<Designation>>("/designacao", {
      params: query,
    });
    return data;
  },

  async create(sector: Sector) {
    const { data } = await browserApi.post<Designation>("/designacao", {
      sector,
    });
    return data;
  },

  async update(id: string, sector: Sector) {
    const { data } = await browserApi.put<Designation>(
      `/designacao/${encodeURIComponent(id)}`,
      { sector },
    );
    return data;
  },

  async remove(id: string) {
    await browserApi.delete(`/designacao/${encodeURIComponent(id)}`);
  },
};
