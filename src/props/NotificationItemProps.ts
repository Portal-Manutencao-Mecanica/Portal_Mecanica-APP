export interface NotificationItemProps {
  id: number | string; 
  title: string;
  about: string | null;
  isUnread?: boolean;
  onClick?: () => void;
}
