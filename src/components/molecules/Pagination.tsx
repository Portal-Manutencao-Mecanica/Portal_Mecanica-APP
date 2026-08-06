"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import Button from "@/components/atoms/Button";
import type { PaginationProps } from "@/props/PaginationProps";

function visiblePages(page: number, totalPages: number) {
  const first = Math.max(0, Math.min(page - 2, totalPages - 5));
  const last = Math.min(totalPages, first + 5);
  return Array.from({ length: Math.max(0, last - first) }, (_, index) => first + index);
}

export default function Pagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const pageCount = Math.max(1, totalPages);
  const currentPage = Math.min(Math.max(0, page), pageCount - 1);
  const isFirst = currentPage === 0;
  const isLast = currentPage >= pageCount - 1;

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row"
    >
      <p className="text-sm text-gray-500">
        Página <strong className="text-gray-800">{currentPage + 1}</strong> de{" "}
        <strong className="text-gray-800">{pageCount}</strong>
        {typeof totalElements === "number" && (
          <> · {totalElements} registro(s)</>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="secondary"
          icon={ChevronsLeft}
          iconOnly
          aria-label="Ir para a primeira página"
          title="Primeira página"
          disabled={disabled || isFirst}
          onClick={() => onPageChange(0)}
        />
        <Button
          variant="secondary"
          icon={ChevronLeft}
          iconOnly
          aria-label="Ir para a página anterior"
          title="Página anterior"
          disabled={disabled || isFirst}
          onClick={() => onPageChange(currentPage - 1)}
        />

        <div className="hidden items-center gap-2 sm:flex">
          {visiblePages(currentPage, pageCount).map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? "primary" : "secondary"}
              aria-label={`Ir para a página ${pageNumber + 1}`}
              aria-current={pageNumber === currentPage ? "page" : undefined}
              disabled={disabled}
              className="min-w-10 px-3"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="secondary"
          icon={ChevronRight}
          iconOnly
          aria-label="Ir para a próxima página"
          title="Próxima página"
          disabled={disabled || isLast}
          onClick={() => onPageChange(currentPage + 1)}
        />
        <Button
          variant="secondary"
          icon={ChevronsRight}
          iconOnly
          aria-label="Ir para a última página"
          title="Última página"
          disabled={disabled || isLast}
          onClick={() => onPageChange(pageCount - 1)}
        />
      </div>
    </nav>
  );
}
