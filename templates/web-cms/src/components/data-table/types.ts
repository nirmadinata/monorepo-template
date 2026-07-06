import type { ColumnDef, Row } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface ColumnActionItem<TData> {
    label: string;
    icon?: LucideIcon;
    onClick: (row: Row<TData>) => void;
    variant?: "default" | "destructive";
    disabled?: (row: Row<TData>) => boolean;
}

export interface DataTablePagination {
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

/** Automatic pagination: TanStack Table handles pagination based on the data array length. */
export interface AutomaticPagination {
    type: "automatic";
    /** Initial page size (default: 10). */
    defaultPageSize?: number;
}

/** Manual pagination: the caller controls pagination with cursor/offset externally. */
export interface ManualPagination {
    type: "manual";
    pageIndex: number;
    pageSize: number;
    total: number;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Pagination config:
 * - `"automatic"` (shorthand) – pagination determined by the data array
 * - `{ type: "automatic" }` – with optional `defaultPageSize`
 * - `{ type: "manual" }` – externally controlled with cursor/offset
 */
export type DataTablePaginationConfig = "automatic" | AutomaticPagination | ManualPagination;

export interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    enableRowSelection?: boolean;
    enableSorting?: boolean;
    horizontalScroll?: boolean;
    /** Pagination mode: `"automatic"` for data-driven or `{ type: "manual", ... }` for external control. */
    pagination?: DataTablePaginationConfig;
    onRowClick?: (row: Row<TData>) => void;
    emptyMessage?: string;
    className?: string;
}

export interface ColumnNumberingOptions {
    header?: string;
    cell?: (index: number) => ReactNode;
}

export interface ColumnTextOptions<TData> {
    header?: string;
    sortable?: boolean;
    cell?: (value: unknown, row: Row<TData>) => ReactNode;
}

export interface ColumnImageOptions<TData> {
    header?: string;
    size?: "sm" | "default" | "lg";
    shape?: "circle" | "rectangle";
    fallback?: string | ((row: Row<TData>) => string);
    cell?: (value: unknown, row: Row<TData>) => ReactNode;
}

export interface ColumnLinkOptions<TData> {
    header?: string;
    target?: string;
    sortable?: boolean;
    renderLink?: (href: string, row: Row<TData>) => ReactNode;
    cell?: (value: unknown, row: Row<TData>) => ReactNode;
}

export interface ColumnSelectOptions {
    header?: string;
}

export interface ColumnActionOptions<TData> {
    icon: LucideIcon;
    label: string;
    onClick: (row: Row<TData>) => void;
}

export interface ColumnActionsOptions<TData> {
    items: ColumnActionItem<TData>[];
    label?: string;
}
