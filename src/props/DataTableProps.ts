import { ReactNode } from "react";
import { ColumnProps } from "./ColumnProps";
import { ToggleGroupOption } from "./ToggleGroupProps";

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnProps<T>[];
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    emptyMessage?: string;
    filterElement?: ReactNode;

    toggleOptions?: ToggleGroupOption[];
    toggleValue?: string;
    onToggleChange?: (value: string) => void;
}