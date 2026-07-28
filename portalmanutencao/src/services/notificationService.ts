import type { Notification } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const notificationService = {
  async list() {
    const { data } = await browserApi.get<Notification[]>("/notification");
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
