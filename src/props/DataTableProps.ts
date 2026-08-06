import { ReactNode } from "react";
import { ColumnProps } from "./ColumnProps";
import { ToggleGroupOption } from "./ToggleGroupProps";

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnProps<T>[];
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    emptyMessage?: string;
    filterElement?: ReactNode;
    onRowClick?: (item: T) => void;
    isRowClickable?: (item: T) => boolean;
    getRowAriaLabel?: (item: T) => string;

    toggleOptions?: ToggleGroupOption[];
    toggleValue?: string;
    onToggleChange?: (value: string) => void;
}
