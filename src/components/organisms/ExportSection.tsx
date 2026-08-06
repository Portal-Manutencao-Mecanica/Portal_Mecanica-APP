'use client';

import { useState } from "react";
import ToggleGroup from "@/components/molecules/ToggleGroup";
import Button from "@/components/atoms/Button";

export default function ExportSection() {
    const [exportType, setExportType] = useState("pdf");
    const [exportScope, setExportScope] = useState("todos");

    const typeOptions = [
        { value: "pdf", label: "PDF" },
        { value: "csv", label: "CSV" },
    ];

    const scopeOptions = [
        { value: "todos", label: "Todos" },
        { value: "filtrados", label: "Filtrados" },
        { value: "selecionados", label: "Apenas Selecionado" },
    ];

    const handleExport = () => {
        alert(`Exportando como: ${exportType.toUpperCase()} | Escopo: ${exportScope}`);
    };

    return (
        <div className="flex items-end gap-12 bg-gray-50/50 p-8 rounded-2xl border border-gray-100 w-fit">
            {/* Grupo 1: Tipo */}
            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium text-gray-900">Tipo de Exportação</h3>
                <ToggleGroup options={typeOptions} value={exportType} onChange={setExportType} />
            </div>

            {/* Grupo 2: Escopo */}
            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-medium text-gray-900">O que será exportado</h3>
                <ToggleGroup options={scopeOptions} value={exportScope} onChange={setExportScope} />
            </div>

            {/* Botão */}
            <Button variant="primary" onClick={handleExport}>
                Exportar
            </Button>
        </div>
    );
}