import type { Inconvenience5S } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const inconvenienceService = {
  async list() {
    const { data } = await browserApi.get<Inconvenience5S[]>("/5s");
    return data;
  },
};
