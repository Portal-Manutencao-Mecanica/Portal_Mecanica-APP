import Link from "next/link";

import type { ButtonProps } from "@/props/ButtonProps";

const baseStyle = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-weg-blue text-white hover:bg-weg-blue/90",
  secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  warning: "bg-weg-warning text-gray-900 hover:bg-weg-warning/85",
  danger: "bg-weg-negative text-white hover:bg-weg-negative/85",
};

export default function Button({
  variant = "primary",
  icon: Icon,
  iconOnly = false,
  children,
  className = "",
  disabled = false,
  type,
  href,
  onClick,
  ...props
}: ButtonProps) {
  const selectedVariant = variants[variant];
  const sizeStyle = iconOnly ? "w-10 px-0" : "px-4";
  const buttonClassName = `${baseStyle} ${selectedVariant} ${sizeStyle} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClassName}
        aria-disabled={disabled || undefined}
        aria-label={props["aria-label"]}
        aria-describedby={props["aria-describedby"]}
        title={props.title}
        tabIndex={disabled ? -1 : props.tabIndex}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        {children}
      </Link>
    );
  }

  const buttonType = type === "submit" || type === "reset" ? type : "button";

  return (
    <button
      type={buttonType}
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
    </button>
  );
}
