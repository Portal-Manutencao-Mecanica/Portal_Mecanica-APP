    "use client";

    import Button from "../atoms/Button";
    import { ConfirmDialogProps } from "@/props/ConfirmDialogProps";

    export default function ConfirmDialog({
    open,
    title,
    description,
    onCancel,
    onConfirm,
    }: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

        <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="border-b border-gray-200 p-6">

            <h2 className="text-xl font-bold">
                {title}
            </h2>

            </div>

            <div className="p-6">

            <p className="text-gray-600">
                {description}
            </p>

            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">

            <Button
                className="bg-gray-500 hover:bg-gray-600"
                onClick={onCancel}
            >
                Cancelar
            </Button>

            <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={onConfirm}
            >
                Excluir
            </Button>

            </div>

        </div>

        </div>
    );
    }