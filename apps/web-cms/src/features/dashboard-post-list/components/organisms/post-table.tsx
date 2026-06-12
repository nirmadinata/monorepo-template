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

import { usePostTable } from "../../hooks/use-post-table";
import type { PostListPageData } from "../types";

interface PostTableProps {
    items: PostListPageData["items"];
    onDeleted: () => Promise<void>;
}

export function PostTable({ items, onDeleted }: PostTableProps) {
    const table = usePostTable({ items, onDeleted });

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
