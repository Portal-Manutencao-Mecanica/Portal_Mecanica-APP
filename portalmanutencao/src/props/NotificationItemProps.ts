export interface NotificationItemProps {
    title: string;
    about: string;
    isUnread?: boolean;
    onClick?: () => void;
}