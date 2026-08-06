import type {
  Organization,
  OrganizationPayload,
  Page,
  PageQuery,
} from "@/lib/api/types";
import { browserApi } from "./httpService";

export const organizationService = {
  async list(query: PageQuery = {}) {
    const { data } = await browserApi.get<Page<Organization>>("/organizations", {
      params: query,
    });
    return data;
  },
  async getById(id: string) {
    const { data } = await browserApi.get<Organization>(
      `/organizations/${encodeURIComponent(id)}`,
    );
    return data;
  },
  async create(payload: OrganizationPayload) {
    const { data } = await browserApi.post<Organization>("/organizations", payload);
    return data;
  },
  async update(id: string, payload: OrganizationPayload) {
    const { data } = await browserApi.patch<Organization>(
      `/organizations/${encodeURIComponent(id)}`,
      payload,
    );
    return data;
  },
  async activate(id: string) {
    const { data } = await browserApi.patch<Organization>(
      `/organizations/${encodeURIComponent(id)}/activate`,
    );
    return data;
  },
  async deactivate(id: string) {
    const { data } = await browserApi.patch<Organization>(
      `/organizations/${encodeURIComponent(id)}/deactivate`,
    );
    return data;
  },
};
