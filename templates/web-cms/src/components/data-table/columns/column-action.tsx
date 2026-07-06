import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "#/components/ui/button";

import type { ColumnActionOptions } from "../types";

export function columnAction<TData>(opts: ColumnActionOptions<TData>): ColumnDef<TData> {
    const Icon = opts.icon;

    return {
        id: "__action",
        header: "",
        enableSorting: false,
        size: 48,
        cell: ({ row }) => (
            <Button
                variant="ghost"
                size="icon-xs"
                aria-label={opts.label}
                onClick={() => opts.onClick(row)}
            >
                <Icon />
            </Button>
        ),
    } as ColumnDef<TData>;
}
