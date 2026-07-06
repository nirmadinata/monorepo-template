"use client";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type {
    SortingState,
    RowSelectionState,
    Table as TanstackTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "#/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils.ts";

import type { DataTableProps, DataTablePagination } from "./types";

function SortingIndicator({ sorted }: { sorted: false | "asc" | "desc" }) {
    if (!sorted) {
        return <ArrowUpDownIcon className="ml-1 size-3 text-muted-foreground" />;
    }
    if (sorted === "asc") {
        return <ArrowUpIcon className="ml-1 size-3" />;
    }
    return <ArrowDownIcon className="ml-1 size-3" />;
}

const PAGE_SIZES = [10, 20, 30, 50];

function PaginationFooter<TData>({
    table,
    serverSide,
}: {
    table: TanstackTable<TData>;
    serverSide?: DataTablePagination;
}) {
    if (serverSide) {
        const pageCount = Math.ceil(serverSide.total / serverSide.pageSize);
        const currentPage = serverSide.pageIndex;

        return (
            <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{serverSide.total} total</span>
                    <Select
                        value={String(serverSide.pageSize)}
                        onValueChange={(val) => {
                            serverSide.onPageSizeChange?.(Number(val));
                        }}
                    >
                        <SelectTrigger size="sm" className="w-18">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZES.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                size="sm"
                                className={
                                    currentPage === 0 ? "pointer-events-none opacity-50" : ""
                                }
                                onClick={() => {
                                    if (currentPage > 0) {
                                        serverSide.onPageChange(currentPage - 1);
                                    }
                                }}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <span className="flex items-center px-2 text-sm">
                                {currentPage + 1} of {pageCount || 1}
                            </span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                size="sm"
                                className={
                                    currentPage >= pageCount - 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                                onClick={() => {
                                    if (currentPage < pageCount - 1) {
                                        serverSide.onPageChange(currentPage + 1);
                                    }
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        );
    }

    const pageCount = table.getPageCount();
    if (pageCount <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                        1}
                    {"–"}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                            table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length}
                </span>
                <Select
                    value={String(table.getState().pagination.pageSize)}
                    onValueChange={(val) => {
                        table.setPageSize(Number(val));
                    }}
                >
                    <SelectTrigger size="sm" className="w-18">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {PAGE_SIZES.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            size="sm"
                            className={
                                table.getCanPreviousPage() ? "" : "pointer-events-none opacity-50"
                            }
                            onClick={() => table.previousPage()}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="flex items-center px-2 text-sm">
                            {table.getState().pagination.pageIndex + 1} of {pageCount}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            size="sm"
                            className={
                                table.getCanNextPage() ? "" : "pointer-events-none opacity-50"
                            }
                            onClick={() => table.nextPage()}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

// oxlint-disable-next-line react/react-compiler
export function DataTable<TData>({
    columns,
    data,
    enableRowSelection,
    enablePagination = false,
    defaultPageSize = 10,
    enableSorting = false,
    horizontalScroll = false,
    serverSidePagination,
    onRowClick,
    emptyMessage = "No results.",
    className,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const hasSelectColumn = columns.some((col) => col.id === "__select");
    const isRowSelectionEnabled = enableRowSelection ?? hasSelectColumn;

    const isManualPagination = !!serverSidePagination;
    const pageCount = serverSidePagination
        ? Math.ceil(serverSidePagination.total / serverSidePagination.pageSize)
        : undefined;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),

        enableSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        onSortingChange: setSorting,

        enableRowSelection: isRowSelectionEnabled,
        onRowSelectionChange: setRowSelection,
        manualPagination: isManualPagination,
        pageCount,
        initialState: {
            pagination:
                enablePagination && !isManualPagination ? { pageSize: defaultPageSize } : undefined,
        },
        state: {
            sorting,
            rowSelection,
        },
    });

    return (
        <div className={cn("w-full", className)}>
            <div className="rounded-md border">
                <Table
                    className={cn(horizontalScroll && "[&_table]:w-max [&_td]:whitespace-nowrap")}
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    const isSorted = header.column.getIsSorted();
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width:
                                                    header.getSize() === 150
                                                        ? undefined
                                                        : header.getSize(),
                                            }}
                                            className={cn(canSort && "cursor-pointer select-none")}
                                            onClick={
                                                canSort
                                                    ? header.column.getToggleSortingHandler()
                                                    : undefined
                                            }
                                        >
                                            <div className="flex items-center">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {canSort && <SortingIndicator sorted={isSorted} />}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() ? "selected" : undefined}
                                    className={cn(onRowClick && "cursor-pointer")}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {(enablePagination || serverSidePagination) && (
                <PaginationFooter table={table} serverSide={serverSidePagination} />
            )}
        </div>
    );
}
