"use client";

import { forwardRef, useId, useState, type ChangeEvent } from "react";

import type { TextAreaProps } from "@/props/TextAreaProps";

function getTextLength(value: TextAreaProps["value"] | TextAreaProps["defaultValue"]) {
  if (Array.isArray(value)) {
    return value.join(",").length;
  }

  return value === undefined || value === null ? 0 : String(value).length;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      label,
      error,
      maxLength,
      onChange,
      rows = 4,
      className = "",
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledLength, setUncontrolledLength] = useState(() =>
      getTextLength(defaultValue),
    );
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const currentLength = value === undefined
      ? uncontrolledLength
      : getTextLength(value);

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
      setUncontrolledLength(event.target.value.length);
      onChange?.(event);
    }

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div
          className={`flex w-full items-start justify-between rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:border-weg-blue/60 focus-within:border-weg-blue focus-within:ring-2 focus-within:ring-weg-blue/20 has-[:disabled]:bg-gray-100 has-[:disabled]:hover:border-gray-200 ${error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200" : "border-gray-200"} ${className}`}
        >
          <textarea
            {...props}
            ref={ref}
            id={inputId}
            rows={rows}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="w-full resize-none border-none bg-transparent text-gray-900 outline-none placeholder:italic placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400"
          />

          {maxLength !== undefined && (
            <span className="self-end whitespace-nowrap pl-2 text-xs text-gray-500 select-none">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        {error && (
          <span id={errorId} className="text-sm text-red-700">
            {error}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
