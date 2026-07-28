import type { MaintenanceRequestApi } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const maintenanceRequestService = {
  async list() {
    const { data } = await browserApi.get<MaintenanceRequestApi[]>(
      "/solicitao-manutencao",
    );
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<MaintenanceRequestApi>(
      `/solicitao-manutencao/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async create(payload: {
    sector: string;
    priority: string;
    assignedStudentIds: string[];
    placeId: string;
    description: string;
    notifiedTeacherId: string;
    machineId: string;
  }) {
    const { data } = await browserApi.post<MaintenanceRequestApi>(
      "/solicitao-manutencao",
      payload,
    );
    return data;
  },
};
