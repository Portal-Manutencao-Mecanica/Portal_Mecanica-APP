import type { Notification, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";

function notifyNotificationChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("notifications:changed"));
  }
}

export const notificationService = {
  async list(page = 0, size = 20) {
    const { data } = await browserApi.get<Page<Notification>>("/notification", {
      params: { page, size },
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Notification>(
      `/notification/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async unreadCount() {
    const { data } = await browserApi.get<number>("/notification/unread-count");
    return data;
  },

  async markAsRead(id: string) {
    const { data } = await browserApi.patch<Notification>(
      `/notification/${encodeURIComponent(id)}/read`,
    );
    notifyNotificationChange();
    return data;
  },

  async markAllAsRead() {
    await browserApi.patch("/notification/read-all");
    notifyNotificationChange();
  },

  async toggleRead(id: string) {
    const { data } = await browserApi.patch<Notification>(
      `/notification/${encodeURIComponent(id)}/toggle-read`,
    );
    notifyNotificationChange();
    return data;
  },
};
