import type { Notification, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const notificationService = {
  async list(params?: { page?: number; size?: number }) {
    const { data } = await browserApi.get<Page<Notification>>("/notification", {
      params,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Notification>(
      `/notification/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async markAsRead(id: string) {
    const { data } = await browserApi.patch<Notification>(
      `/notification/${encodeURIComponent(id)}/read`,
    );
    return data;
  },

  async markAllAsRead() {
    await browserApi.patch("/notification/read-all");
  },

  async toggleRead(id: string) {
    const { data } = await browserApi.patch<Notification>(
      `/notification/${encodeURIComponent(id)}/toggle-read`,
    );
    return data;
  },
};
