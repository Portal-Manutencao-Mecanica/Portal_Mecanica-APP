"use client";

import Button from "../atoms/Button";
import { ConfirmDialogProps } from "@/props/ConfirmDialogProps";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  confirmVariant = "primary",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b border-gray-200 p-6">
          <h2 id="confirm-dialog-title" className="text-xl font-bold">{title}</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>

          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
