export interface NotificationData {
  id: number | string;
  email: string;
  title: string;
  about: string;
  description: string;
  statusRead: boolean;
}

export interface NotificationDetailProps {
  notification: NotificationData;
  onMarkAsRead?: () => void;
}
