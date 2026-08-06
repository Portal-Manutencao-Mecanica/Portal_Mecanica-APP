import type { ButtonHTMLAttributes, ElementType } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "warning" | "danger";
  icon?: ElementType;
  iconOnly?: boolean;
  href?: string;
}
