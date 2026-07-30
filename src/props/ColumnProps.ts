import { ReactNode } from "react";

export interface ColumnProps<T> {
    header: string;
    accessorKey?: keyof T;
    render?: (item: T) => ReactNode;
    align?: "left" | "center" | "right";
}