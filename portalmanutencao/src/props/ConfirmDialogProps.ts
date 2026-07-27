export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;

  confirmText?: string;
  confirmVariant?: "primary" | "secondary" | "warning" | "danger";

  onCancel: () => void;
  onConfirm: () => void;
}