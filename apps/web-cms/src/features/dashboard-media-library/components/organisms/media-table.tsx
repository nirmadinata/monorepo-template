import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table";

import { MediaPreview } from "../atoms/media-preview";
import { MediaDeleteAction } from "../molecules/media-delete-action";
import { MediaTagsAction } from "../molecules/media-tags-action";
import type { MediaLibraryPageData } from "../types";

interface MediaTableProps {
    items: MediaLibraryPageData["items"];
    onDeleted: () => Promise<void>;
}

export function MediaTable({ items, onDeleted }: MediaTableProps) {
    return (
        <Card className="border-border/75 bg-card/80 shadow-none">
            <CardContent className="px-0 py-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-4">Preview</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="px-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => {
                            const displayName =
                                item.name || item.originalFilename || `Media #${item.id}`;

                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="px-4">
                                        <MediaPreview item={item} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-foreground">
                                                {displayName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.originalFilename || item.mimeType}
                                            </span>
                                            {item.previewError ? (
                                                <span className="text-xs text-destructive">
                                                    Preview unavailable for this asset.
                                                </span>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.mimeType}</Badge>
                                    </TableCell>
                                    <TableCell>{item.fileSizeLabel}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.tags.length > 0 ? (
                                                item.tags.map((tag) => (
                                                    <Badge key={tag.id} variant="secondary">
                                                        {tag.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    No tags
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.previewUrl ? (
                                                <Button
                                                    nativeButton={false}
                                                    render={
                                                        <a
                                                            aria-label={`Open ${displayName}`}
                                                            className="no-underline"
                                                            href={item.previewUrl}
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
                                                mediaId={item.id}
                                                mediaName={displayName}
                                                onUpdated={onDeleted}
                                                tagNames={item.tags.map((tag) => tag.name)}
                                            />
                                            <MediaDeleteAction
                                                mediaId={item.id}
                                                mediaName={displayName}
                                                onDeleted={onDeleted}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
