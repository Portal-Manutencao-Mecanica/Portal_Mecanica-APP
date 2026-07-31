import { LucideIcon } from "lucide-react";

export default interface DashboardStatCardProps {
  title: string;
  value: string;
  helper?: string;
  badgeLabel?: string;
  badgeColorClass?: string;
  accentClass: string;
  icon: LucideIcon;
}