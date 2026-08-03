"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { DropDownProps } from "@/props/DropDownProps";

export default function DropDown({
  defaultSelection,
  enumData,
  onSelect,
  label,
  error,
  className = "",
  value = "",
  disabled = false,
  id,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const options = Object.entries(enumData);
  const selectedLabel = options.find(([optionValue]) => optionValue === value)?.[1];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(optionValue: string) {
    onSelect(optionValue);
    setIsOpen(false);
  }

  return (
    <div className="flex w-full flex-col gap-1.5" ref={containerRef}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>}

      <div className="relative">
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setIsOpen((current) => !current)}
          className={`flex min-h-10 w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-left text-sm shadow-sm transition-colors hover:border-weg-blue/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weg-blue/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${isOpen ? "border-weg-blue ring-2 ring-weg-blue/20" : "border-gray-200"} ${error ? "border-red-500" : ""} ${className}`}
        >
          <span className={selectedLabel ? "text-gray-800" : "italic text-gray-400"}>{selectedLabel ?? defaultSelection}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-weg-blue" : ""}`} />
        </button>

        {isOpen && !disabled && (
          <div role="listbox" aria-labelledby={inputId} className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            <button type="button" role="option" aria-selected={!value} onClick={() => selectOption("")} className="w-full border-b border-gray-100 px-4 py-2.5 text-left text-sm italic text-gray-400 hover:bg-gray-50">
              {defaultSelection}
            </button>
            {options.map(([optionValue, optionLabel]) => (
              <button key={optionValue} type="button" role="option" aria-selected={value === optionValue} onClick={() => selectOption(optionValue)} className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${value === optionValue ? "bg-weg-blue/80 font-medium text-white" : "text-gray-700 hover:bg-gray-50 hover:text-weg-blue"}`}>
                {optionLabel}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <span id={errorId} className="text-sm text-red-700">{error}</span>}
    </div>
  );
}
