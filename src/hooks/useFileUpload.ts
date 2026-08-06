import { useRef, useState } from "react";

import type { UploadedFileProps } from "@/props/UploadedFileProps";
import { isAllowedFileType } from "@/utils/validationFiles";

interface UseFileUploadOptions {
  maxFiles?: number;
  maxFileSizeBytes?: number;
}

export function useFileUpload({
  maxFiles = Number.POSITIVE_INFINITY,
  maxFileSizeBytes = Number.POSITIVE_INFINITY,
}: UseFileUploadOptions = {}) {
  const [files, setFiles] = useState<UploadedFileProps[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFiles(selectedFiles: FileList | File[]) {
    const candidates = Array.from(selectedFiles);
    const validFiles = candidates.filter(
      (file) => isAllowedFileType(file.name) && file.size <= maxFileSizeBytes,
    );
    const availableSlots = Math.max(0, maxFiles - files.length);
    const filesToProcess = validFiles.slice(0, availableSlots);

    if (validFiles.length !== candidates.length) {
      setFileError("Selecione apenas imagens permitidas com o tamanho informado.");
    } else if (availableSlots === 0 || filesToProcess.length !== validFiles.length) {
      setFileError(`Envie no máximo ${maxFiles} imagens.`);
    } else {
      setFileError("");
    }

    const uploadedFiles = await Promise.all(
      filesToProcess.map(
        (file) =>
          new Promise<UploadedFileProps>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ fileObject: file, fileContent: reader.result });
            reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
            reader.readAsDataURL(file);
          }),
      ),
    );

    setFiles((currentFiles) => [...currentFiles, ...uploadedFiles]);
  }

  async function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    try {
      await processFiles(event.target.files);
    } catch {
      setFileError("Não foi possível ler a imagem selecionada.");
    } finally {
      event.target.value = "";
    }
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
  }

  async function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length === 0) return;

    try {
      await processFiles(event.dataTransfer.files);
    } catch {
      setFileError("Não foi possível ler a imagem selecionada.");
    }
  }

  function removeFile(indexToRemove: number) {
    setFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove),
    );
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  return {
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
  };
}
