import type { Machine } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const machineService = {
  async list() {
    const { data } = await browserApi.get<Machine[]>("/maquinas");
    return data;
  },
};
