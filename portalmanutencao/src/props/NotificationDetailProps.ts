export interface NotificationData {
  id: number;
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