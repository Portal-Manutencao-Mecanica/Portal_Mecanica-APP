import type { CreateMachineLog, MachineLog, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const machineLogService = {
  async list() {
    const { data } = await browserApi.get<Page<MachineLog>>("/maquina-log");
    return data;
  },

  async create(payload: CreateMachineLog) {
    const { data } = await browserApi.post<MachineLog>("/maquina-log", payload);
    return data;
  },
};