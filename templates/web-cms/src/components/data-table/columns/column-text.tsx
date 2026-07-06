import type { ColumnDef } from "@tanstack/react-table";

import type { ColumnTextOptions } from "../types";

export function columnText<TData>(
    accessorKey: string,
    opts?: ColumnTextOptions<TData>
): ColumnDef<TData> {
    const customCell = opts?.cell;

    return {
        accessorKey,
        header: opts?.header ?? accessorKey,
        enableSorting: opts?.sortable ?? true,
        cell: customCell
            ? ({ getValue, row }) => customCell(getValue(), row)
            : ({ getValue }) => {
                  const value = getValue();
                  if (value === null || value === undefined) {
                      return "";
                  }
                  return String(value);
              },
    } as ColumnDef<TData>;
}
