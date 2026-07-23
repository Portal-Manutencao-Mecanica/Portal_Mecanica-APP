import { NotificationData } from "./NotificationDetailProps";

export interface NotificationListProps {
  notifications: NotificationData[];
  onSelectNotification?: (id: number) => void;
  onMarkAllAsRead?: () => void;
}