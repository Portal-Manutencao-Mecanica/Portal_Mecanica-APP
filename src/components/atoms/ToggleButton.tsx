"use client";

import { useState } from "react";

import type { ToggleButtonProps } from "@/props/ToggleButtonProps";

export default function ToggleButton({
  label,
  checked: controlledChecked,
  defaultChecked = false,
  onToggle,
  disabled = false,
  className = "",
  variant = "button",
  onClick,
  ...props
}: ToggleButtonProps) {
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = isControlled ? controlledChecked : internalChecked;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    const nextChecked = !checked;

    if (!isControlled) setInternalChecked(nextChecked);
    onToggle?.(nextChecked);
    onClick?.(event);
  }

  if (variant === "switch") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={props["aria-label"] ?? label}
        disabled={disabled}
        onClick={handleClick}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue focus-visible:ring-offset-2 ${checked ? "bg-weg-blue" : "bg-gray-300"} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}
        {...props}
      >
        <span
          aria-hidden="true"
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue focus-visible:ring-offset-2 ${checked ? "border-weg-blue bg-weg-blue text-white" : "border-gray-300 bg-white text-gray-800 hover:border-weg-blue/60"} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
}
