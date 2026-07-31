export interface User {
  name: string;
  role?: string;
  email?: string;
}

export interface UserAvatarProps {
  user: User;
  href?: string;
  isExpanded?: boolean;
}