import type { ColumnDef, Row } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { cn } from "#/lib/utils.ts";

import type { ColumnImageOptions } from "../types";

export function columnImage<TData>(
    accessorKey: string,
    opts?: ColumnImageOptions<TData>
): ColumnDef<TData> {
    const header = opts?.header ?? accessorKey;
    const customCell = opts?.cell;
    const fallbackOpt = opts?.fallback;
    const shape = opts?.shape ?? "circle";

    function getFallback(row: Row<TData>): string {
        if (!fallbackOpt) {
            return "";
        }
        if (typeof fallbackOpt === "function") {
            return fallbackOpt(row);
        }
        return fallbackOpt;
    }

    const rectSizeMap: Record<string, string> = {
        sm: "size-8",
        default: "size-12",
        lg: "size-20",
    };

    return {
        accessorKey,
        header,
        enableSorting: false,
        cell: customCell
            ? ({ getValue, row }) => customCell(getValue(), row)
            : ({ getValue, row }) => {
                  const src = getValue();
                  if (!src || typeof src !== "string") {
                      return null;
                  }
                  if (shape === "rectangle") {
                      return (
                          <img
                              src={src}
                              alt={header}
                              className={cn(
                                  "rounded-md bg-muted object-cover",
                                  rectSizeMap[opts?.size ?? "default"]
                              )}
                          />
                      );
                  }
                  return (
                      <Avatar size={opts?.size ?? "default"}>
                          <AvatarImage src={src} alt={header} />
                          <AvatarFallback>{getFallback(row)}</AvatarFallback>
                      </Avatar>
                  );
              },
    } as ColumnDef<TData>;
}
