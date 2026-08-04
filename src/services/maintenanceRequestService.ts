import type {
  CreateMaintenanceRequest,
  MaintenanceApproval,
  MaintenanceRequestApi,
  MaintenanceRequestPriority,
  Page,
  PageQuery,
} from "@/lib/api/types";
import { browserApi } from "./httpService";

export const maintenanceRequestService = {
  async list(query: PageQuery & {
    search?: string;
    status?: string;
    priority?: MaintenanceRequestPriority;
  } = {}) {
    const { data } = await browserApi.get<Page<MaintenanceRequestApi>>(
      "/solicitao-manutencao",
      { params: query },
    );
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<MaintenanceRequestApi>(
      `/solicitao-manutencao/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async create(payload: CreateMaintenanceRequest) {
    const { data } = await browserApi.post<MaintenanceRequestApi>(
      "/solicitao-manutencao",
      payload,
    );
    return data;
  },

  async update(id: string, payload: CreateMaintenanceRequest) {
    const { data } = await browserApi.put<MaintenanceRequestApi>(
      `/solicitao-manutencao/${encodeURIComponent(id)}`,
      payload,
    );
    return data;
  },

  async remove(id: string) {
    await browserApi.delete(`/solicitao-manutencao/${encodeURIComponent(id)}`);
  },

  async approve(id: string, payload: MaintenanceApproval) {
    const { data } = await browserApi.patch<MaintenanceRequestApi>(
      `/solicitao-manutencao/${encodeURIComponent(id)}/aprovacao`,
      payload,
    );
    return data;
  },

  async approveWorkOrder(id: string, payload: MaintenanceApproval) {
    const { data } = await browserApi.patch<MaintenanceRequestApi>(
      `/solicitao-manutencao/${encodeURIComponent(id)}/ordem/aprovacao`,
      payload,
    );
    return data;
  },
};
