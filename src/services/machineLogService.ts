import type { CreateMachineLog, MachineLog, Page, PageQuery } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const machineLogService = {
  async list(query: PageQuery & { machineId?: string } = {}) {
    const { data } = await browserApi.get<Page<MachineLog>>("/maquina-log", {
      params: query,
    });
    return data;
  },

  async create(payload: CreateMachineLog) {
    const { data } = await browserApi.post<MachineLog>("/maquina-log", payload);
    return data;
  },
};
