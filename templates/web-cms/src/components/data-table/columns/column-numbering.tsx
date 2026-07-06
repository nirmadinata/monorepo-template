import type { ColumnDef } from "@tanstack/react-table";

import type { ColumnNumberingOptions } from "../types";

export function columnNumbering<TData>(opts?: ColumnNumberingOptions): ColumnDef<TData> {
    const header = opts?.header ?? "#";

    return {
        id: "__numbering",
        header,
        enableSorting: false,
        size: 48,
        cell: ({ row }) => {
            const index = row.index + 1;
            return opts?.cell ? opts.cell(index) : index;
        },
    } as ColumnDef<TData>;
}
