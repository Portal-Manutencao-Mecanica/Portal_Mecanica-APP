import type { Place } from "@/lib/api/types";

import { browserApi } from "./httpService";

export const placeService = {
  async list() {
    const { data } = await browserApi.get<Place[]>("/lugar");
    return data;
  },

  async create(name: string) {
    const { data } = await browserApi.post<Place>("/lugar", { name });
    return data;
  },

  async update(id: string, name: string) {
    const { data } = await browserApi.put<Place>(
      `/lugar/${encodeURIComponent(id)}`,
      { name },
    );
    return data;
  },

  async remove(id: string) {
    await browserApi.delete(`/lugar/${encodeURIComponent(id)}`);
  },
};
