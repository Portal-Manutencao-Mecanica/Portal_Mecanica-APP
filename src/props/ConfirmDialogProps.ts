export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;

  confirmText?: string;
  confirmVariant?: "primary" | "secondary" | "warning" | "danger";
  confirming?: boolean;

  onCancel: () => void;
  onConfirm: () => void;
}
