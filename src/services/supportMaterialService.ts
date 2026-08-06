import type { HelperMaterial, Page, PageQuery } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const supportMaterialService = {
  async list(query: PageQuery = {}) {
    const { data } = await browserApi.get<Page<HelperMaterial>>("/material-apoio", {
      params: query,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<HelperMaterial>(
      `/material-apoio/${encodeURIComponent(id)}`,
    );
    return data;
  },
};
