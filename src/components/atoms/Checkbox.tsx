"use client";

import { forwardRef, useId } from "react";

import type { CheckboxProps } from "@/props/CheckboxProps";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, description, error, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className={`flex min-h-10 cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm transition-colors hover:border-weg-blue/60 has-focus-visible:ring-2 has-focus-visible:ring-weg-blue/20 has-disabled:cursor-not-allowed has-disabled:bg-gray-100 ${className}`}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-describedby={describedBy}
            className="mt-0.5 h-4 w-4 shrink-0 accent-weg-blue focus-visible:outline-none disabled:cursor-not-allowed"
            {...props}
          />
          <span className="min-w-0">
            <span className="block font-medium text-gray-800">{label}</span>
            {description && (
              <span id={descriptionId} className="mt-0.5 block text-xs text-gray-500">
                {description}
              </span>
            )}
          </span>
        </label>
        {error && (
          <span id={errorId} className="block text-sm text-red-700">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
