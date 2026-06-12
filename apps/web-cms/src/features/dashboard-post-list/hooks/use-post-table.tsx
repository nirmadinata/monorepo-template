import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { Badge } from "#/components/ui/badge";

import { PostCoverPreview } from "../components/atoms/post-cover-preview";
import { PostDeleteAction } from "../components/molecules/post-delete-action";
import type { PostListPageData } from "../components/types";
import { formatPostStatus } from "../lib/post-list";

interface UsePostTableParams {
    items: PostListPageData["items"];
    onDeleted: () => Promise<void>;
}

export function usePostTable({ items, onDeleted }: UsePostTableParams) {
    const columns = useMemo<ColumnDef<PostListPageData["items"][number]>[]>(
        () => [
            {
                id: "cover",
                header: "Cover",
                cell: ({ row }) => <PostCoverPreview item={row.original} />,
                meta: { className: "px-4" },
            },
            {
                id: "title",
                header: "Title",
                cell: ({ row }) => (
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">{row.original.title}</span>
                        {row.original.excerpt ? (
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                                {row.original.excerpt}
                            </span>
                        ) : null}
                    </div>
                ),
            },
            {
                id: "status",
                header: "Status",
                cell: ({ row }) => (
                    <Badge variant="outline">{formatPostStatus(row.original.status)}</Badge>
                ),
            },
            {
                id: "actions",
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => (
                    <div className="flex items-center justify-end gap-2">
                        <PostDeleteAction
                            postId={row.original.id}
                            postTitle={row.original.title}
                            onDeleted={onDeleted}
                        />
                    </div>
                ),
                meta: { className: "px-4" },
            },
        ],
        [onDeleted]
    );

    const table = useReactTable({
        columns,
        data: items,
        getCoreRowModel: getCoreRowModel(),
    });

    return table;
}
