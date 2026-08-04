"use client";

import { useEffect, useId, useRef } from "react";
import { FileImage, Trash2, Upload } from "lucide-react";

import Button from "@/components/atoms/Button";
import SafeImage from "@/components/atoms/SafeImage";
import { useFileUpload } from "@/hooks/useFileUpload";
import type { UploadedFileProps } from "@/props/UploadedFileProps";
import formatBytes from "@/utils/formatBytes";

interface UploadedFile64Props {
  value?: string[];
  onChange?: (base64List: string[]) => void;
  error?: string;
  id?: string;
  maxFiles?: number;
  maxFileSizeBytes?: number;
  disabled?: boolean;
}

function sameImages(first: string[], second: string[]) {
  return first.length === second.length && first.every((image, index) => image === second[index]);
}

function imageContents(files: UploadedFileProps[]) {
  return files
    .map((file) => file.fileContent)
    .filter((content): content is string => typeof content === "string" && content.length > 0);
}

export default function UploadedFile64({
  value = [],
  onChange,
  error,
  id,
  maxFiles,
  maxFileSizeBytes,
  disabled = false,
}: UploadedFile64Props) {
  const generatedId = useId();
  const inputId = id ?? `uploaded-file-${generatedId}`;
  const onChangeRef = useRef(onChange);
  const previousValueRef = useRef(value);
  const skipNextChangeRef = useRef(false);
  const {
    files,
    fileError,
    isDragging,
    fileInputRef,
    setFiles,
    handleFilesChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    openFileDialog,
  } = useFileUpload({ maxFiles, maxFileSizeBytes });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (sameImages(value, previousValueRef.current)) return;

    previousValueRef.current = value;
    if (!sameImages(value, imageContents(files))) {
      skipNextChangeRef.current = true;
      setFiles(value.map((fileContent) => ({ fileContent })));
    }
  }, [files, setFiles, value]);

  useEffect(() => {
    if (skipNextChangeRef.current) {
      skipNextChangeRef.current = false;
      return;
    }
    onChangeRef.current?.(imageContents(files));
  }, [files]);

  const feedback = error || fileError;
  const dropzoneStyle = isDragging
    ? "border-weg-blue bg-weg-blue/10! text-gray-700 hover:bg-weg-blue/10!"
    : feedback
      ? "border-weg-negative bg-red-50! text-weg-negative! hover:border-weg-negative hover:bg-red-50!"
      : disabled
        ? "border-gray-200 bg-gray-100! text-gray-500 hover:border-gray-200 hover:bg-gray-100!"
        : "border-gray-300 bg-gray-50! text-gray-700 hover:border-weg-blue/60 hover:bg-weg-blue/5!";

  return (
    <div className="space-y-4">
      <input
        id={inputId}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        ref={fileInputRef}
        onChange={handleFilesChange}
        className="sr-only"
        disabled={disabled}
      />

      <Button
        type="button"
        variant="secondary"
        onClick={openFileDialog}
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
        disabled={disabled}
        aria-describedby={`${inputId}-help`}
        className={`min-h-40 w-full flex-col border-2 border-dashed shadow-none ${dropzoneStyle}`}
      >
        <Upload className="h-8 w-8" aria-hidden="true" />
        <span>Selecionar imagens</span>
        <span className="text-xs font-normal text-gray-500">ou solte os arquivos aqui</span>
      </Button>

      {feedback && <p className="text-sm text-weg-negative">{feedback}</p>}

      {files.length > 0 && (
        <ul className="space-y-2" aria-live="polite">
          {files.map((item, index) => (
            <li
              key={`${index}-${item.fileObject?.name ?? "imagem"}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {typeof item.fileContent === "string" ? (
                    <SafeImage
                      src={item.fileContent}
                      alt={item.fileObject?.name ?? `Imagem da ocorrência ${index + 1}`}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <FileImage className="h-6 w-6 text-gray-500" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {item.fileObject?.name ?? `Imagem da ocorrência ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.fileObject ? formatBytes(item.fileObject.size) : "Imagem já salva"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                icon={Trash2}
                iconOnly
                onClick={() => removeFile(index)}
                disabled={disabled}
                aria-label={`Remover imagem ${index + 1}`}
                title={`Remover imagem ${index + 1}`}
                className="shadow-none"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
