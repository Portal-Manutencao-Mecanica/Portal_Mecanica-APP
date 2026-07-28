import type { CreateEquipment, Equipment } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const equipmentService = {
  async list() {
    const { data } = await browserApi.get<Equipment[]>("/equipamento");
    return data;
  },

  async create(equipment: CreateEquipment) {
    const { data } = await browserApi.post<Equipment>("/equipamento", equipment);
    return data;
  },
};
