import type { Notification, Page } from '@/lib/api/types';
import { browserApi } from './httpService';

interface NotificationListOptions {
  page?: number;
  size?: number;
}

export const notificationService = {
  async list({ page = 0, size = 100 }: NotificationListOptions = {}) {
    const { data } = await browserApi.get<Page<Notification>>('/notification', {
      params: { page, size },
    });
    return data.content;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Notification>(
      `/notification/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async unreadCount() {
    const { data } = await browserApi.get<number>('/notification/unread-count');
    return data;
  },

  async markAllAsRead() {
    await browserApi.patch('/notification/read-all');
  },

  async markAsRead(id: string) {
    const { data } = await browserApi.patch<Notification>(
      `/notification/${encodeURIComponent(id)}/read`,
    );
    return data;
  },

  async toggleRead(id: string) {
    const { data } = await browserApi.patch<Notification>(
      `/notification/${encodeURIComponent(id)}/toggle-read`,
    );
    return data;
  },

  async delete(id: string) {
    await browserApi.delete(`/notification/${encodeURIComponent(id)}`);
  },
};
