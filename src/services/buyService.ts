import type { Buy, CreateBuy, Page, PageQuery } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const buyService = {
  async list(query: PageQuery & { search?: string; status?: string } = {}) {
    const { data } = await browserApi.get<Page<Buy>>("/compras", {
      params: query,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Buy>(`/compras/${encodeURIComponent(id)}`);
    return data;
  },

  async create(payload: CreateBuy) {
    const { data } = await browserApi.post<Buy>("/compras", payload);
    return data;
  },

  async update(id: string, payload: CreateBuy) {
    const { data } = await browserApi.put<Buy>(
      `/compras/${encodeURIComponent(id)}`,
      payload,
    );
    return data;
  },
};
