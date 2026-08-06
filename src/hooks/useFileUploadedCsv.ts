import { useRef, useState } from "react";

export interface CsvFileState {
  fileObject: File;
  previewLines: string[];
}

export function useFileUploadedCsv() {
  const [file, setFile] = useState<CsvFileState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    if (!selectedFile.name.toLocaleLowerCase("pt-BR").endsWith(".csv")) {
      setFile(null);
      setValidationError("Selecione um arquivo CSV.");
      return;
    }

    try {
      const content = await selectedFile.text();
      const previewLines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 5);

      setFile({ fileObject: selectedFile, previewLines });
      setValidationError(null);
    } catch {
      setFile(null);
      setValidationError("Não foi possível ler o arquivo CSV selecionado.");
    }
  }

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    void processFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDragging(false);
    void processFile(event.dataTransfer.files?.[0]);
  }

  function removeFile() {
    setFile(null);
    setValidationError(null);
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  return {
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
  };
}
