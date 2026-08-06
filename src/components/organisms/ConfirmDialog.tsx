"use client";

import { useEffect, useRef } from "react";

import type { ConfirmDialogProps } from "@/props/ConfirmDialogProps";
import Button from "../atoms/Button";

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  confirmVariant = "primary",
  confirming = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCancelRef = useRef(onCancel);
  const confirmingRef = useRef(confirming);

  useEffect(() => {
    onCancelRef.current = onCancel;
    confirmingRef.current = confirming;
  }, [confirming, onCancel]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.querySelector<HTMLElement>(focusableSelector)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !confirmingRef.current) {
        event.preventDefault();
        onCancelRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
      >
        <div className="border-b border-gray-200 p-6">
          <h2 id="confirm-dialog-title" className="text-xl font-bold text-gray-900">
            {title}
          </h2>
        </div>

        <div className="p-6">
          <p id="confirm-dialog-description" className="text-gray-600">
            {description}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 p-6 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={confirming}>
            Cancelar
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? "Processando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
