"use client";

import { useState, useMemo, type KeyboardEvent } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { DataTableProps } from "@/props/DataTableProps";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import ToggleGroup from "../molecules/ToggleGroup";

export default function DataTable<T>({
    data,
    columns,
    searchPlaceholder = "Buscar...",
    searchKeys = [],
    searchValue,
    onSearchChange,
    emptyMessage = "Nenhum registro encontrado.",
    filterElement,
    onRowClick,
    isRowClickable = () => Boolean(onRowClick),
    getRowAriaLabel,
    toggleOptions,
    toggleValue,
    onToggleChange,
}: DataTableProps<T>) {
    const [internalSearchTerm, setInternalSearchTerm] = useState("");
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRow = (index: number) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const searchTerm = searchValue ?? internalSearchTerm;
    const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

    const filteredData = useMemo(() => {
        if (onSearchChange) return safeData;
        if (!searchTerm || searchKeys.length === 0) return safeData;

        return safeData.filter((item) =>
            searchKeys.some((key) => {
                const value = item[key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [onSearchChange, safeData, searchTerm, searchKeys]);

    const getAlignmentClass = (align?: "left" | "center" | "right") => {
        switch (align) {
            case "center": return "text-center";
            case "right": return "text-right";
            default: return "text-left";
        }
    };

    const handleRowKeyDown = (event: KeyboardEvent<HTMLElement>, item: T) => {
        if ((event.key === "Enter" || event.key === " ") && onRowClick) {
            event.preventDefault();
            onRowClick(item);
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
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        if (onSearchChange) onSearchChange(value);
                                        else setInternalSearchTerm(value);
                                    }}
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

            {/* VISUALIZAÇÃO MOBILE: CARDS (< 768px) */}
            <div className="block md:hidden divide-y divide-gray-100">
                {filteredData.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">
                        {emptyMessage}
                    </div>
                ) : (
                    filteredData.map((item, rowIndex) => {
                        const isExpanded = expandedRows.has(rowIndex);
                        const rowIsClickable = Boolean(onRowClick && isRowClickable(item));
                        // No mobile, se não estiver expandido, mostra apenas as 2 primeiras colunas
                        const visibleColumns = isExpanded ? columns : columns.slice(0, 2);

                        return (
                            <div
                                key={rowIndex}
                                className={`space-y-4 bg-white p-4 transition-colors ${rowIsClickable ? "cursor-pointer hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-weg-blue" : "hover:bg-gray-50/50"}`}
                                role={rowIsClickable ? "link" : undefined}
                                tabIndex={rowIsClickable ? 0 : undefined}
                                aria-label={rowIsClickable ? getRowAriaLabel?.(item) ?? "Visualizar registro" : undefined}
                                onClick={rowIsClickable ? () => onRowClick?.(item) : undefined}
                                onKeyDown={rowIsClickable ? (event) => handleRowKeyDown(event, item) : undefined}
                            >
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
                                
                                {/* Botão para expandir/recolher o card inteiro */}
                                <Button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        toggleRow(rowIndex);
                                    }}
                                    onKeyDown={(event) => event.stopPropagation()}
                                    variant="secondary"
                                    className="mt-2 w-full border border-gray-200 bg-gray-50 text-sm text-gray-600 shadow-none hover:bg-gray-100"
                                >
                                    {isExpanded ? (
                                        <>Ocultar detalhes <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>Mostrar mais <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </Button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* VISUALIZAÇÃO DESKTOP: TABELA TRADICIONAL (>= 768px) */}
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
                            filteredData.map((item, rowIndex) => {
                                const rowIsClickable = Boolean(onRowClick && isRowClickable(item));

                                return (
                                <tr
                                    key={rowIndex}
                                    className={`transition-colors ${rowIsClickable ? "cursor-pointer hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-weg-blue" : "hover:bg-gray-50/80"}`}
                                    role={rowIsClickable ? "link" : undefined}
                                    tabIndex={rowIsClickable ? 0 : undefined}
                                    aria-label={rowIsClickable ? getRowAriaLabel?.(item) ?? "Visualizar registro" : undefined}
                                    onClick={rowIsClickable ? () => onRowClick?.(item) : undefined}
                                    onKeyDown={rowIsClickable ? (event) => handleRowKeyDown(event, item) : undefined}
                                >
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
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
