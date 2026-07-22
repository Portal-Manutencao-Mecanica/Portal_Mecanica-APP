'use client'

import { useFileUpload } from "@/hooks/useFileUpload";
import { FileImage, Trash2, Upload, X } from "lucide-react";
import formatBytes from "@/utils/formatBytes";
import Button from "../atoms/Button";

export default function UploadedFile() {

    const {
        files,
        isDragging,
        fileInputRef,
        handleFilesChange,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeFile,
        handleSubmit,
        openFileDialog
    } = useFileUpload();

    return (
        <div className="w-full max-w-xl mx-auto p-4 flex flex-col gap-4">
            {/* Input nativo oculto */}
            <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                ref={fileInputRef}
                onChange={handleFilesChange}
                className="hidden"
            />

            {/* Caixa de Dropzone (Seletor de Arquivos) */}
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
                        : 'border-gray-300 bg-gray-100 hover:bg-gray-200/70 hover:border-gray-400'
                    }
        `}
            >
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-3" />

                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                    Selecione um arquivo
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs">
                    ou solte aqui
                </p>
            </div>

            
            {files.length > 0 && (
                <div className="flex flex-col gap-2.5 mt-2">
                    {files.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-200/60 rounded-xl border border-gray-200/80 transition-all hover:bg-gray-200"
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                
                                <div className="w-12 h-12 rounded-lg bg-gray-300/80 shrink-0 flex items-center justify-center overflow-hidden border border-gray-300">
                                    {typeof item.fileContent === 'string' ? (
                                        <img
                                            src={item.fileContent}
                                            alt={item.fileObject.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FileImage className="w-6 h-6 text-gray-500" />
                                    )}
                                </div>

                                {/* Nome e Tamanho do Arquivo */}
                                <div className="flex flex-col min-w-0">
                                    <p className="font-semibold text-sm text-gray-800 truncate">
                                        {item.fileObject.name}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {formatBytes(item.fileObject.size)}
                                    </p>
                                </div>
                            </div>

                            {/* Botão de Remover */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita abrir a janela de arquivo ao clicar em remover
                                    removeFile(index);
                                }}
                                className="p-1.5 text-gray-400  hover:bg-gray-300/50 rounded-lg transition-colors"
                                title="Remover arquivo"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );



}