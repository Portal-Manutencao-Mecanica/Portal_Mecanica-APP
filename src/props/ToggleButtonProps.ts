import { ButtonHTMLAttributes } from "react";

export interface ToggleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
    label?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onToggle?: (checked: boolean) => void;
}