"use client";

import { useEffect } from "react";
import { FileSpreadsheet, Trash2, Upload } from "lucide-react";

import Button from "@/components/atoms/Button";
import { useFileUploadedCsv } from "@/hooks/useFileUploadedCsv";
import formatBytes from "@/utils/formatBytes";

interface UploadedCsvProps {
  onChange?: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export default function UploadedCsv({
  onChange,
  error,
  disabled = false,
}: UploadedCsvProps) {
  const {
    file,
    isDragging,
    validationError,
    fileInputRef,
    handleFilesChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    openFileDialog,
  } = useFileUploadedCsv();
  const errorMessage = error ?? validationError;

  useEffect(() => {
    onChange?.(file?.fileObject ?? null);
  }, [file, onChange]);

  return (
    <div className="space-y-4">
      <input
        id="user-csv-file"
        type="file"
        accept=".csv,text/csv"
        ref={fileInputRef}
        onChange={handleFilesChange}
        className="sr-only"
        disabled={disabled}
      />

      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-48 w-full flex-col border-2 border-dashed px-6 py-8 text-center ${
          isDragging
            ? "border-weg-blue bg-weg-blue/10"
            : errorMessage
              ? "border-red-500 bg-red-50 text-red-700"
              : "border-gray-300 bg-gray-50 text-gray-700 hover:border-weg-blue/60 hover:bg-weg-blue/5"
        }`}
      >
        <Upload className="h-8 w-8" aria-hidden="true" />
        <span className="text-base font-semibold">Selecione o arquivo CSV</span>
        <span className="text-sm font-normal text-gray-500">
          Ou arraste e solte o arquivo nesta área.
        </span>
      </Button>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {file && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-weg-positive/10 text-weg-positive">
                <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {file.fileObject.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatBytes(file.fileObject.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              icon={Trash2}
              onClick={removeFile}
              aria-label="Remover arquivo CSV selecionado"
            >
              <span className="sr-only">Remover arquivo</span>
            </Button>
          </div>

          {file.previewLines.length > 0 && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-700">Prévia do conteúdo</p>
              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                {file.previewLines.map((line, index) => (
                  <li key={`${line}-${index}`} className="truncate">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
