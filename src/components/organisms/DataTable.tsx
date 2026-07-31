"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { DataTableProps } from "@/props/DataTableProps";
import Input from "../atoms/Input";
import ToggleGroup from "../molecules/ToggleGroup";

export default function DataTable<T>({
    data,
    columns,
    searchPlaceholder = "Buscar...",
    searchKeys = [],
    emptyMessage = "Nenhum registro encontrado.",
    filterElement,
    toggleOptions,
    toggleValue,
    onToggleChange,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (index: number) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const tableData = Array.isArray(data) ? data : [];

    const filteredData = useMemo(() => {
        if (!searchTerm || searchKeys.length === 0) return tableData;

        return tableData.filter((item) =>
            searchKeys.some((key) => {
                const value = item[key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [tableData, searchTerm, searchKeys]);

    const getAlignmentClass = (align?: "left" | "center" | "right") => {
        switch (align) {
            case "center": return "text-center";
            case "right": return "text-right";
            default: return "text-left";
        }
    };

    const hasHeaderControls = searchKeys.length > 0 || filterElement || (toggleOptions && toggleOptions.length > 0)

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Barra de Topo em GRID */}
            {hasHeaderControls && (
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {searchKeys.length > 0 && (
                            <div className="md:col-span-7 relative w-full">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        )}
                        <div className={`flex items-center justify-start md:justify-end gap-3 flex-wrap ${searchKeys.length > 0 ? "md:col-span-5" : "md:col-span-12"}`}>
                            {filterElement}
                            {toggleOptions && toggleOptions.length > 0 && (
                                <ToggleGroup
                                    options={toggleOptions.slice(0, 3)}
                                    value={toggleValue || ""}
                                    onChange={onToggleChange || (() => {})}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* VISUALIZAÃ‡ÃƒO MOBILE: CARDS (< 768px) */}
            <div className="block md:hidden divide-y divide-gray-100">
                {filteredData.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                        {emptyMessage}
                    </div>
                ) : (
                    filteredData.map((item: any, rowIndex) => {
                        const isExpanded = expandedRows.has(rowIndex);
                        // No mobile, se nÃ£o estiver expandido, mostra apenas as 2 primeiras colunas
                        const visibleColumns = isExpanded ? columns : columns.slice(0, 2);

                        return (
                            <div key={rowIndex} className="p-4 space-y-4 bg-white hover:bg-gray-50/50 transition-colors">
                                <div className="space-y-3">
                                    {visibleColumns.map((col, colIndex) => {
                                        const content = col.render
                                            ? col.render(item)
                                            : col.accessorKey
                                                ? String(item[col.accessorKey] ?? "")
                                                : null;

                                        if (!content) return null;

                                        return (
                                            <div key={colIndex} className="flex flex-col gap-1 border-b border-gray-50 pb-2 last:border-b-0 last:pb-0">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                    {col.header}
                                                </span>
                                                <div className={`text-sm ${getAlignmentClass(col.align)}`}>
                                                    {content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* BotÃ£o para expandir/recolher o card inteiro */}
                                <button
                                    onClick={() => toggleRow(rowIndex)}
                                    className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                                >
                                    {isExpanded ? (
                                        <>Ocultar detalhes <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>Mostrar mais <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* VISUALIZAÃ‡ÃƒO DESKTOP: TABELA TRADICIONAL (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider border-y border-gray-100">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-3 ${getAlignmentClass(col.align)}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item: any, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50/80 transition-colors">
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-4 ${getAlignmentClass(col.align)}`}
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : col.accessorKey
                                                    ? String(item[col.accessorKey] ?? "")
                                                    : null}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}