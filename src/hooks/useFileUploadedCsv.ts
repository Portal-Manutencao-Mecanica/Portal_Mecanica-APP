import { useState, useRef } from 'react';

export interface CsvFileState {
  fileObject: File;
  content: string; // Conteúdo de texto puro do CSV
  previewEmails: string[]; // Primeiros e-mails para preview visual
}

export function useFileUploadedCsv() {
  const [files, setFiles] = useState<CsvFileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (selectedFiles: FileList | File[]) => {
    const filesArray = Array.from(selectedFiles);

    // Valida apenas extensoes CSV
    const validFiles = filesArray.filter((file) => {
      const isValid = file.name.endsWith('.csv') || file.type === 'text/csv';
      if (!isValid) {
        alert(`O arquivo "${file.name}" não é um CSV válido!`);
      }
      return isValid;
    });

    const processFile = (file: File): Promise<CsvFileState> => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        // 💡 Lê o CSV como texto puro (não Base64)
        reader.readAsText(file, 'UTF-8');

        reader.onload = () => {
          const textContent = (reader.result as string) || '';

          // Extrai linhas simples para extrair e-mails para prévia (preview)
          const lines = textContent
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

          // Pega os primeiros 5 e-mails para exibir na tela
          const previewEmails = lines.slice(0, 5);

          resolve({
            fileObject: file,
            content: textContent,
            previewEmails,
          });
        };
      });
    };

    const newFiles = await Promise.all(validFiles.map(processFile));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(event.target.files);
      event.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return {
    files,
    isDragging,
    fileInputRef,
    handleFilesChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    openFileDialog,
  };
}