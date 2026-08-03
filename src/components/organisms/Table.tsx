"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { TableProps } from "@/props/TableProps";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

export function Table<T extends { id: string | number }>({
  columns,
  data,
  emptyMessage = "Nenhum registro encontrado.",
  variant = "card", // Default continua sendo o card com borda
  searchValue,
  onSearchChange,
  searchPlaceholder = "Pesquisar...",
  actions,
}: TableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showHeader = onSearchChange || actions;
  const mobilePreviewCount = 2;

  // 🔑 Define a estilização externa com base na variante
  const containerStyle =
    variant === "card"
      ? "bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden"
      : "bg-transparent overflow-hidden"; // Variante "plain" fica transparente e sem bordas

  return (
    <div className={`w-full ${containerStyle}`}>
      {/* 1. BARRA SUPERIOR (BUSCA E AÇÕES) */}
      {showHeader && (
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100">
          {onSearchChange && (
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          )}

          {actions && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* 2. VISÃO DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/80 text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`py-3.5 px-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, index) => (
                    <td key={index} className={`py-3.5 px-4 ${col.className || ""}`}>
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-gray-400 text-sm font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. VISÃO MOBILE */}
      <div className="block md:hidden divide-y divide-gray-100">
        {data.length > 0 ? (
          data.map((item) => {
            const isExpanded = !!expandedRows[item.id];
            const previewColumns = columns.slice(0, mobilePreviewCount);
            const extraColumns = columns.slice(mobilePreviewCount);

            return (
              <div key={item.id} className="p-4 flex flex-col gap-3">
                {previewColumns.map((col, index) => (
                  <div key={index} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {col.header}
                    </span>
                    <div className="text-sm text-gray-800">
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </div>
                  </div>
                ))}

                {isExpanded && (
                  <div className="flex flex-col gap-3 pt-1 border-t border-gray-100/60 mt-1">
                    {extraColumns.map((col, index) => (
                      <div key={index} className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {col.header}
                        </span>
                        <div className="text-sm text-gray-800">
                          {typeof col.accessor === "function"
                            ? col.accessor(item)
                            : (item[col.accessor] as React.ReactNode)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {extraColumns.length > 0 && (
                  <Button
                    onClick={() => toggleRow(item.id)}
                    variant="secondary"
                    className="mt-1 w-full border border-gray-200/80 bg-gray-50 text-xs text-gray-600 shadow-none hover:bg-gray-100"
                  >
                    {isExpanded ? (
                      <>
                        <span>Ocultar detalhes</span>
                        <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                      </>
                    ) : (
                      <>
                        <span>Mostrar mais</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm font-medium">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
