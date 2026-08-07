import type {
  CreateHelperMaterial,
  HelperMaterial,
  Page,
  PageQuery,
} from "@/lib/api/types";
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

  async create(payload: CreateHelperMaterial) {
    const { data } = await browserApi.post<HelperMaterial>("/material-apoio", payload);
    return data;
  },

  async update(id: string, payload: CreateHelperMaterial) {
    const { data } = await browserApi.put<HelperMaterial>(
      `/material-apoio/${encodeURIComponent(id)}`,
      payload,
    );
    return data;
  },

  async remove(id: string) {
    await browserApi.delete(`/material-apoio/${encodeURIComponent(id)}`);
  },
};
