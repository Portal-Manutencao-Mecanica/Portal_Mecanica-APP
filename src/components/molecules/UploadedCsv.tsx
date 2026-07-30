'use client';

import { useEffect, useRef } from "react";
import { useFileUploadedCsv } from "@/hooks/useFileUploadedCsv";
import { FileSpreadsheet, Trash2, Upload, Mail } from "lucide-react";
import formatBytes from "@/utils/formatBytes";

interface UploadedCsvProps {
  onChange?: (files: File[]) => void; // Passa os arquivos nativos para o formulário
  error?: string;
}

export default function UploadCsv({ onChange, error }: UploadedCsvProps) {
  const {
    files,
    isDragging,
    fileInputRef,
    handleFilesChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    openFileDialog
  } = useFileUploadedCsv();

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Notifica o form principal passando os objetos File prontos para envio
  useEffect(() => {
    if (!onChangeRef.current) return;
    const rawFiles = files.map((f) => f.fileObject);
    onChangeRef.current(rawFiles);
  }, [files]);

  return (
    <div className="w-full max-w-xl mx-auto p-4 flex flex-col gap-4">
      <input
        type="file"
        accept=".csv, text/csv, application/vnd.ms-excel"
        ref={fileInputRef}
        onChange={handleFilesChange}
        className="hidden"
      />

      {/* Caixa de Dropzone */}
      <div
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center 
          p-6 sm:p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none text-center
          ${isDragging
            ? 'border-blue-500 bg-blue-50/50'
            : error 
              ? 'border-red-400 bg-red-50/30' 
              : 'border-gray-300 bg-gray-100 hover:bg-gray-200/70'
          }
        `}
      >
        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-3" />
        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
          Selecione o arquivo CSV
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs">
          ou arraste e solte o arquivo com a lista de e-mails aqui
        </p>
      </div>

      {error && (
        <span className="text-xs font-medium text-red-500 text-center">
          {error}
        </span>
      )}

      {/* Lista de CSVs Carregados */}
      {files.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          {files.map((item, index) => (
            <div
              key={index}
              className="flex flex-col p-3 bg-gray-100 rounded-xl border border-gray-200 gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-green-100 shrink-0 flex items-center justify-center border border-green-200">
                    <FileSpreadsheet className="w-5 h-5 text-green-700" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {item.fileObject.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {formatBytes(item.fileObject.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Remover arquivo"
                >
                  <Trash2 className="w-5 h-5 text-gray-400 cursor-pointer" />
                </button>
              </div>

              {/* Prévia dos e-mails identificados */}
              {item.previewEmails.length > 0 && (
                <div className="bg-white p-2.5 rounded-lg border border-gray-200 text-xs text-gray-600">
                  <div className="flex items-center gap-1 font-medium text-gray-700 mb-1">
                    <Mail className="w-3.5 h-3.5" /> Prévia do conteúdo:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                    {item.previewEmails.map((emailLine, i) => (
                      <li key={i} className="truncate">{emailLine}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}