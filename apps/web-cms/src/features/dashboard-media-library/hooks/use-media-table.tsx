import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { MediaPreview } from "#/features/dashboard-media-library/components/atoms/media-preview";
import { MediaDeleteAction } from "#/features/dashboard-media-library/components/molecules/media-delete-action";
import { MediaTagsAction } from "#/features/dashboard-media-library/components/molecules/media-tags-action";
import type { MediaLibraryPageData } from "#/features/dashboard-media-library/components/types";

type MediaItem = MediaLibraryPageData["items"][number];

function getDisplayName(item: MediaItem) {
    return item.name || item.originalFilename || `Media #${item.id}`;
}

interface UseMediaTableParams {
    items: MediaLibraryPageData["items"];
    onDeleted: () => Promise<void>;
}

// oxlint-disable-next-line react/react-compiler
export function useMediaTable({ items, onDeleted }: UseMediaTableParams) {
    const columns = useMemo<ColumnDef<MediaItem>[]>(
        () => [
            {
                id: "preview",
                header: "Preview",
                cell: ({ row }) => <MediaPreview item={row.original} />,
                meta: { className: "px-4" },
            },
            {
                id: "name",
                header: "Name",
                cell: ({ row }) => {
                    const displayName = getDisplayName(row.original);

                    return (
                        <div className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{displayName}</span>
                            <span className="text-xs text-muted-foreground">
                                {row.original.originalFilename || row.original.mimeType}
                            </span>
                            {row.original.previewError ? (
                                <span className="text-xs text-destructive">
                                    Preview unavailable for this asset.
                                </span>
                            ) : null}
                        </div>
                    );
                },
            },
            {
                id: "type",
                header: "Type",
                cell: ({ row }) => <Badge variant="outline">{row.original.mimeType}</Badge>,
            },
            {
                id: "size",
                header: "Size",
                cell: ({ row }) => row.original.fileSizeLabel,
            },
            {
                id: "tags",
                header: "Tags",
                cell: ({ row }) => {
                    const toDisplayTagNames = row.original.tags.slice(0, 2);

                    return (
                        <div className="flex flex-wrap gap-1.5">
                            {toDisplayTagNames.length ? (
                                toDisplayTagNames.map((tag) => (
                                    <Badge key={tag.id} variant="secondary">
                                        {tag.name}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-xs text-muted-foreground">No tags</span>
                            )}
                        </div>
                    );
                },
            },
            {
                id: "actions",
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const displayName = getDisplayName(row.original);

                    return (
                        <div className="flex items-center justify-end gap-2">
                            {row.original.previewUrl ? (
                                <Button
                                    nativeButton={false}
                                    render={
                                        <a
                                            aria-label={`Open ${displayName}`}
                                            className="no-underline"
                                            href={row.original.previewUrl}
                                            rel="noreferrer"
                                            target="_blank"
                                        />
                                    }
                                    size="sm"
                                    variant="ghost"
                                >
                                    Open
                                </Button>
                            ) : null}
                            <MediaTagsAction
                                mediaId={row.original.id}
                                mediaName={displayName}
                                onUpdated={onDeleted}
                                tagNames={row.original.tags.map((tag) => tag.name)}
                            />
                            <MediaDeleteAction
                                mediaId={row.original.id}
                                mediaName={displayName}
                                onDeleted={onDeleted}
                            />
                        </div>
                    );
                },
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
