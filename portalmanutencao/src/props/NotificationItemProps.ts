export interface NotificationItemProps {
  id: number | string; 
  title: string;
  about: string;
  isUnread?: boolean;
  onClick?: () => void;
}