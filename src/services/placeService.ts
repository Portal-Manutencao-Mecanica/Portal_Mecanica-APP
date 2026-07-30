import type { Place } from "@/lib/api/types";

import { browserApi } from "./httpService";

export const placeService = {
  async list() {
    const { data } = await browserApi.get<Place[]>("/lugar");
    return data;
  },
};
