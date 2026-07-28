import type { MaintenanceRequestApi } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const maintenanceRequestService = {
  async list() {
    const { data } = await browserApi.get<MaintenanceRequestApi[]>(
      "/solicitao-manutencao",
    );
    return data;
  },
};
