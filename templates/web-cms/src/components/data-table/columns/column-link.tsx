import type { ColumnDef } from "@tanstack/react-table";

import type { ColumnLinkOptions } from "../types";

export function columnLink<TData>(
    accessorKey: string,
    opts?: ColumnLinkOptions<TData>
): ColumnDef<TData> {
    const header = opts?.header ?? accessorKey;
    const target = opts?.target ?? "_blank";
    const customCell = opts?.cell;
    const renderLink = opts?.renderLink;

    return {
        accessorKey,
        header,
        enableSorting: opts?.sortable ?? true,
        cell: customCell
            ? ({ getValue, row }) => customCell(getValue(), row)
            : ({ getValue, row }) => {
                  const href = getValue();
                  if (!href || typeof href !== "string") {
                      return null;
                  }

                  const linkContent = (
                      <a
                          href={href}
                          target={target}
                          rel={target === "_blank" ? "noopener noreferrer" : undefined}
                          className="text-primary underline-offset-4 hover:underline"
                      >
                          {href}
                      </a>
                  );

                  return renderLink ? renderLink(href, row) : linkContent;
              },
    } as ColumnDef<TData>;
}
