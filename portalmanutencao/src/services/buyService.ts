import type { Buy } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const buyService = {
  async list() {
    const { data } = await browserApi.get<Buy[]>("/compras");
    return data;
  },
};
