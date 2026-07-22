// src/hooks/useFileUpload.ts
import { useState, useRef } from 'react';
import { FilePayloadProps } from "@/props/FilePayloadProps";
import { UploadedFileProps } from "@/props/UploadedFileProps";
import { isAllowedFileType } from "@/utils/validationFiles";

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFileProps[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const processFiles = async (selectedFiles: FileList | File[]) => {
    const filesArray = Array.from(selectedFiles);

    const validFiles = filesArray.filter((file) => {
      const isValid = isAllowedFileType(file.name);
      if (!isValid) {
        alert(`O arquivo "${file.name}" não é permitido. Apenas imagens são aceitas!`);
      }
      return isValid;
    });

    const processFile = (file: File): Promise<UploadedFileProps> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          resolve({
            fileObject: file,
            fileContent: reader.result,
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    const sendPayload = {
      filePayloadProps: files.map((f): FilePayloadProps => {
        const contentString = typeof f.fileContent === 'string' ? f.fileContent : '';
        const base64Clean = contentString.split(',')[1] || contentString;

        return {
          name: f.fileObject.name,
          fileContent: base64Clean,
          type: f.fileObject.type,
          size: f.fileObject.size,
        };
      }),
    };

    console.log("Payload Final:", JSON.stringify(sendPayload, null, 2));
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
    handleSubmit,
    openFileDialog,
  };
}