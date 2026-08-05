import type {
  CreateInconvenience5S,
  Inconvenience5S,
  Inconvenience5SStatus,
  Page,
  PageQuery,
} from "@/lib/api/types";
import { browserApi } from "./httpService";

export const inconvenienceService = {
  async list(query: PageQuery = {}) {
    const { data } = await browserApi.get<Page<Inconvenience5S>>("/5s", {
      params: query,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Inconvenience5S>(
      `/5s/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async create(payload: CreateInconvenience5S) {
    const { data } = await browserApi.post<Inconvenience5S>("/5s", payload);
    return data;
  },

  async updateStatus(id: string, status: Inconvenience5SStatus) {
    const { data } = await browserApi.patch<Inconvenience5S>(
      `/5s/${encodeURIComponent(id)}`,
      { status },
    );
    return data;
  },
};
