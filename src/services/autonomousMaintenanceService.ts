import type {
  AutonomousMaintenance,
  AutonomousMaintenanceApproval,
  AutonomousMaintenanceRequest,
  AutonomousMaintenanceStatus,
  Page,
} from "@/lib/api/types";
import { browserApi } from "./httpService";

interface AutonomousMaintenanceListParams {
  status?: AutonomousMaintenanceStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export const autonomousMaintenanceService = {
  async list(params: AutonomousMaintenanceListParams = {}) {
    const { data } = await browserApi.get<Page<AutonomousMaintenance>>(
      "/manutencao-autonoma",
      {
        params: {
          page: 0,
          size: 10,
          sort: "scheduledFor,asc",
          ...params,
        },
      },
    );
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<AutonomousMaintenance>(
      `/manutencao-autonoma/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async create(payload: AutonomousMaintenanceRequest) {
    const { data } = await browserApi.post<AutonomousMaintenance>(
      "/manutencao-autonoma",
      payload,
    );
    return data;
  },

  async update(id: string, payload: AutonomousMaintenanceRequest) {
    const { data } = await browserApi.put<AutonomousMaintenance>(
      `/manutencao-autonoma/${encodeURIComponent(id)}`,
      payload,
    );
    return data;
  },

  async decide(id: string, payload: AutonomousMaintenanceApproval) {
    const { data } = await browserApi.patch<AutonomousMaintenance>(
      `/manutencao-autonoma/${encodeURIComponent(id)}/aprovacao`,
      payload,
    );
    return data;
  },

  async remove(id: string) {
    await browserApi.delete(`/manutencao-autonoma/${encodeURIComponent(id)}`);
  },
};
