import { flexRender } from "@tanstack/react-table";

import { Card, CardContent } from "#/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table";
import type { MediaLibraryPageData } from "#/features/dashboard-media-library/components/types";
import { useMediaTable } from "#/features/dashboard-media-library/hooks/use-media-table";

interface MediaTableProps {
    items: MediaLibraryPageData["items"];
    onDeleted: () => Promise<void>;
}

const EMPTY_ITEMS: MediaTableProps["items"] = [];

export function MediaTable({ items = EMPTY_ITEMS, onDeleted }: MediaTableProps) {
    const table = useMediaTable({ items, onDeleted });

    return (
        <Card className="border-border/75 bg-card/80 shadow-none">
            <CardContent className="px-0 py-0">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={
                                            (
                                                header.column.columnDef.meta as
                                                    | Record<string, unknown>
                                                    | undefined
                                            )?.className as string | undefined
                                        }
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={
                                            (
                                                cell.column.columnDef.meta as
                                                    | Record<string, unknown>
                                                    | undefined
                                            )?.className as string | undefined
                                        }
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
