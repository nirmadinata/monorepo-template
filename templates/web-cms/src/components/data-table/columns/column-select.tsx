import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "#/components/ui/checkbox";

import type { ColumnSelectOptions } from "../types";

export function columnSelect<TData>(opts?: ColumnSelectOptions): ColumnDef<TData> {
    return {
        id: "__select",
        header: ({ table }) => (
            <Checkbox
                aria-label={opts?.header ?? "Select all rows"}
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={() => {
                    table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected());
                }}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                aria-label={`Select row ${row.index + 1}`}
                checked={row.getIsSelected()}
                onCheckedChange={() => {
                    row.toggleSelected(!row.getIsSelected());
                }}
            />
        ),
        enableSorting: false,
        size: 48,
    } as ColumnDef<TData>;
}
