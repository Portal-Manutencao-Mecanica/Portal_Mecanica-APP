import { ReactNode } from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  
  // 🔑 Nova prop para controlar o container visual
  variant?: "card" | "plain";

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
}