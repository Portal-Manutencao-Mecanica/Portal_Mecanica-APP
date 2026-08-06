import type { Notification } from "@/lib/api/types";

export type NotificationData = Notification;

export interface NotificationDetailProps {
  notification: NotificationData;
  onMarkAsRead?: () => void;
}
