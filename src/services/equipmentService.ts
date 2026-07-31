import type { CreateEquipment, Equipment, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const equipmentService = {
  async list() {
    const { data } = await browserApi.get<Page<Equipment>>("/equipamento");
    return data;
  },

  async create(equipment: CreateEquipment) {
    const { data } = await browserApi.post<Equipment>("/equipamento", equipment);
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Equipment>(
      `/equipamento/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async update(id: string, equipment: CreateEquipment) {
    const { data } = await browserApi.put<Equipment>(
      `/equipamento/${encodeURIComponent(id)}`,
      equipment,
    );
    return data;
  },

  async remove(id: string) {
    await browserApi.delete(`/equipamento/${encodeURIComponent(id)}`);
  },
};