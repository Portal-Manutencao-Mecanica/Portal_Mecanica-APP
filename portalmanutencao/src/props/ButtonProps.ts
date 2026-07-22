import { ButtonHTMLAttributes, ElementType } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
  icon?: ElementType;
}