'use client'

import React, { useRef, useState } from "react";
import { FilePayloadProps } from "@/props/FilePayloadProps";
import { UploadedFileProps } from "@/props/UploadedFileProps";

import formatBytes from "@/utils/formatBytes";
import { isAllowedFileType } from "@/utils/validationFiles";

export default function UploadedFile() {
    const [files, setFiles] = useState<UploadedFileProps[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

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


        if (fileInputRef.current) {
            fileInputRef.current.value = '';
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
                }
            }),
        };
        console.log("Payload Final:", JSON.stringify(sendPayload, null, 2));
    };

    
}