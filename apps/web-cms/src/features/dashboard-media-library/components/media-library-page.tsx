import { useNavigate } from "@tanstack/react-router";
import { ImageIcon, TriangleAlertIcon, UploadIcon, VideoIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "#/components/ui/dialog";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "#/components/ui/empty";
import { Input } from "#/components/ui/input";
import { NativeSelect, NativeSelectOption } from "#/components/ui/native-select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "#/components/ui/pagination";
import { Progress, ProgressLabel, ProgressValue } from "#/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table";
import { Textarea } from "#/components/ui/textarea";

import { normalizeTagNames } from "../lib/media-library";
import type { getMediaLibraryPage } from "../server/media-library";
import {
    deleteMediaAsset,
    finalizeMediaUpload,
    requestMediaUploadIntent,
    updateMediaTags,
} from "../server/media-library";

interface MediaLibraryPageProps {
    data: Awaited<ReturnType<typeof getMediaLibraryPage>>;
}

interface UploadProgressItem {
    fileName: string;
    id: string;
    progress: number;
    status: "done" | "uploading";
}

function MediaPreview({ item }: { item: MediaLibraryPageProps["data"]["items"][number] }) {
    if (item.previewUrl && item.kind === "image") {
        return (
            <img
                alt={
                    item.imageAltText ||
                    item.name ||
                    item.originalFilename ||
                    "Uploaded media preview"
                }
                className="size-12 rounded-lg object-cover ring-1 ring-border/80"
                src={item.previewUrl}
            />
        );
    }

    const Icon = item.kind === "video" ? VideoIcon : ImageIcon;

    return (
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/80">
            <Icon className="size-5 text-muted-foreground" />
        </div>
    );
}

function MediaDeleteAction({
    mediaId,
    mediaName,
    onDeleted,
}: {
    mediaId: number;
    mediaName: string;
    onDeleted: () => Promise<void>;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <AlertDialog>
            <AlertDialogTrigger render={<Button size="sm" variant="outline" />}>
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <TriangleAlertIcon className="text-destructive" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete media?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently removes <strong>{mediaName}</strong> from R2 and deletes
                        its metadata and tag links.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={async () => {
                            setIsDeleting(true);

                            try {
                                await deleteMediaAsset({ data: { mediaId } });
                                toast.success("Media deleted.");
                                await onDeleted();
                            } catch (error) {
                                toast.error(
                                    error instanceof Error
                                        ? error.message
                                        : "Unable to delete this media asset right now."
                                );
                            } finally {
                                setIsDeleting(false);
                            }
                        }}
                        variant="destructive"
                    >
                        {isDeleting ? "Deleting..." : "Delete media"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function MediaTagsAction({
    mediaId,
    mediaName,
    tagNames,
    onUpdated,
}: {
    mediaId: number;
    mediaName: string;
    onUpdated: () => Promise<void>;
    tagNames: string[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [tagDraft, setTagDraft] = useState(tagNames.join(", "));
    const normalizedTagNames = useMemo(
        () => normalizeTagNames(tagDraft.split(/[\n,]+/)),
        [tagDraft]
    );

    return (
        <Dialog
            onOpenChange={(open) => {
                setIsOpen(open);

                if (open) {
                    setTagDraft(tagNames.join(", "));
                }
            }}
            open={isOpen}
        >
            <DialogTrigger render={<Button size="sm" variant="ghost" />}>Tags</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit tags</DialogTitle>
                    <DialogDescription>
                        Update the reusable tags for <strong>{mediaName}</strong>. Separate tags
                        with commas or new lines.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <label
                        className="text-sm font-medium text-foreground"
                        htmlFor={`media-tags-${mediaId}`}
                    >
                        Tags
                    </label>
                    <Textarea
                        id={`media-tags-${mediaId}`}
                        onChange={(event) => {
                            setTagDraft(event.currentTarget.value);
                        }}
                        placeholder="homepage, marketing, hero"
                        rows={4}
                        value={tagDraft}
                    />

                    <div className="flex flex-wrap gap-1.5">
                        {normalizedTagNames.length > 0 ? (
                            normalizedTagNames.map((tagName) => (
                                <Badge key={tagName} variant="secondary">
                                    {tagName}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                No tags will be saved.
                            </span>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose
                        render={<Button disabled={isSaving} type="button" variant="outline" />}
                    >
                        Cancel
                    </DialogClose>
                    <Button
                        disabled={isSaving}
                        onClick={async () => {
                            setIsSaving(true);

                            try {
                                await updateMediaTags({
                                    data: {
                                        mediaId,
                                        tagNames: normalizedTagNames,
                                    },
                                });

                                toast.success("Tags updated.");
                                setIsOpen(false);
                                await onUpdated();
                            } catch (error) {
                                toast.error(
                                    error instanceof Error
                                        ? error.message
                                        : "Unable to update tags right now."
                                );
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                        type="button"
                    >
                        {isSaving ? "Saving..." : "Save tags"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function UploadProgressCard({ uploads }: { uploads: readonly UploadProgressItem[] }) {
    if (uploads.length === 0) {
        return null;
    }

    return (
        <Card className="border-border/75 bg-card/80 shadow-none">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Uploading files</CardTitle>
                <CardDescription>
                    Direct uploads go to R2 first, then finalize metadata in D1.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {uploads.map((upload) => (
                    <Progress key={upload.id} value={upload.progress}>
                        <ProgressLabel>{upload.fileName}</ProgressLabel>
                        <ProgressValue />
                    </Progress>
                ))}
            </CardContent>
        </Card>
    );
}

function MediaTable({
    items,
    onDeleted,
}: {
    items: MediaLibraryPageProps["data"]["items"];
    onDeleted: () => Promise<void>;
}) {
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

function MediaPagination({
    currentPage,
    filters,
    totalPages,
}: {
    currentPage: number;
    filters: MediaLibraryPageProps["data"]["filters"];
    totalPages: number;
}) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <Pagination className="justify-end">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={
                            currentPage > 1
                                ? `?page=${currentPage - 1}&kind=${filters.kind}&search=${encodeURIComponent(filters.search)}&tag=${encodeURIComponent(filters.tag)}`
                                : undefined
                        }
                        aria-disabled={currentPage <= 1}
                    />
                </PaginationItem>
                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={`?page=${page}&kind=${filters.kind}&search=${encodeURIComponent(filters.search)}&tag=${encodeURIComponent(filters.tag)}`}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        href={
                            currentPage < totalPages
                                ? `?page=${currentPage + 1}&kind=${filters.kind}&search=${encodeURIComponent(filters.search)}&tag=${encodeURIComponent(filters.tag)}`
                                : undefined
                        }
                        aria-disabled={currentPage >= totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export function MediaLibraryPage({ data }: MediaLibraryPageProps) {
    const navigate = useNavigate({ from: "/dashboard/media" });
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploads, setUploads] = useState<UploadProgressItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const hasPartialPreviewFailure = data.items.some((item) => item.previewError);

    const tagOptions = useMemo(
        () => [
            { label: "All tags", value: "" },
            ...data.availableTags.map((tag) => ({ label: tag.name, value: tag.slug })),
        ],
        [data.availableTags]
    );

    async function reloadPage() {
        await navigate({
            to: "/dashboard/media",
            search: (previous) => previous,
            replace: true,
        });
    }

    async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
        const files = [...(event.target.files ?? [])];

        if (files.length === 0) {
            return;
        }

        setIsUploading(true);
        setUploads(
            files.map((file) => ({
                fileName: file.name,
                id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
                progress: 0,
                status: "uploading",
            }))
        );

        try {
            for (const [index, file] of files.entries()) {
                const intent = await requestMediaUploadIntent({
                    data: {
                        fileName: file.name,
                        fileSize: file.size,
                        mimeType: file.type,
                    },
                });

                setUploads((current) =>
                    current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, progress: 10 } : item
                    )
                );

                try {
                    await fetch(intent.uploadUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": file.type,
                        },
                        body: file,
                    });
                } catch (error) {
                    console.log("Upload failed for file", file.name, error);
                }

                setUploads((current) =>
                    current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, progress: 80 } : item
                    )
                );

                await finalizeMediaUpload({
                    data: {
                        description: "",
                        durationSeconds: null,
                        height: null,
                        imageAltText: "",
                        mimeType: file.type,
                        name: "",
                        originalFilename: file.name,
                        sizeInBytes: file.size,
                        storageKey: intent.storageKey,
                        tagNames: [],
                        width: null,
                    },
                });

                setUploads((current) =>
                    current.map((item, itemIndex) =>
                        itemIndex === index
                            ? {
                                  ...item,
                                  progress: 100,
                                  status: "done",
                              }
                            : item
                    )
                );
            }

            toast.success(files.length === 1 ? "Media uploaded." : "Media uploads completed.");
            await reloadPage();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Unable to upload media right now."
            );
        } finally {
            setIsUploading(false);
            event.target.value = "";
            window.setTimeout(() => {
                setUploads([]);
            }, 1000);
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <input
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/quicktime"
                className="sr-only"
                multiple
                onChange={(event) => {
                    void handleFileSelection(event);
                }}
                type="file"
            />

            <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="flex flex-col gap-3">
                    <p className="brand-kicker">Media Library</p>
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        Manage uploaded images and videos.
                    </h1>
                    <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                        Browse uploaded media, preview visible assets with signed URLs, and
                        permanently remove files that are no longer needed.
                    </p>
                </div>

                <div className="flex items-center justify-start gap-3 lg:justify-end">
                    <Badge variant="outline">{data.pagination.totalItems} assets</Badge>
                    <Button
                        disabled={isUploading}
                        onClick={() => {
                            fileInputRef.current?.click();
                        }}
                        type="button"
                    >
                        <UploadIcon />
                        {isUploading ? "Uploading..." : "Upload files"}
                    </Button>
                </div>
            </section>

            <UploadProgressCard uploads={uploads} />

            {hasPartialPreviewFailure ? (
                <Alert>
                    <TriangleAlertIcon />
                    <AlertTitle>Some previews could not be loaded.</AlertTitle>
                    <AlertDescription>
                        Media metadata remains visible so you can still review or delete the
                        affected assets.
                    </AlertDescription>
                </Alert>
            ) : null}

            <Card className="border-border/75 bg-card/80 shadow-none">
                <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end">
                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            className="text-sm font-medium text-foreground"
                            htmlFor="media-search"
                        >
                            Search by name
                        </label>
                        <Input
                            defaultValue={data.filters.search}
                            id="media-search"
                            onKeyDown={(event) => {
                                if (event.key !== "Enter") {
                                    return;
                                }

                                const target = event.currentTarget;

                                void navigate({
                                    to: "/dashboard/media",
                                    search: (previous) => ({
                                        ...previous,
                                        page: 1,
                                        search: target.value,
                                    }),
                                });
                            }}
                            placeholder="Search by media name"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-foreground">Type</span>
                        <NativeSelect
                            onChange={(event) => {
                                void navigate({
                                    to: "/dashboard/media",
                                    search: (previous) => ({
                                        ...previous,
                                        kind: event.currentTarget.value as
                                            | "all"
                                            | "image"
                                            | "video",
                                        page: 1,
                                    }),
                                });
                            }}
                            value={data.filters.kind}
                        >
                            {data.availableKinds.map((kind) => (
                                <NativeSelectOption key={kind} value={kind}>
                                    {kind === "all"
                                        ? "All media"
                                        : `${kind[0]?.toUpperCase()}${kind.slice(1)}s`}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-foreground">Tag</span>
                        <NativeSelect
                            onChange={(event) => {
                                void navigate({
                                    to: "/dashboard/media",
                                    search: (previous) => ({
                                        ...previous,
                                        page: 1,
                                        tag: event.currentTarget.value,
                                    }),
                                });
                            }}
                            value={data.filters.tag}
                        >
                            {tagOptions.map((tag) => (
                                <NativeSelectOption key={tag.value || "all"} value={tag.value}>
                                    {tag.label}
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                    </div>
                </CardContent>
            </Card>

            {data.items.length === 0 ? (
                <Empty className="border border-dashed border-border/80 bg-card/40 px-8 py-14">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ImageIcon />
                        </EmptyMedia>
                        <EmptyTitle>No media uploaded yet</EmptyTitle>
                        <EmptyDescription>
                            Upload your first image or video to start building the library.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={() => {
                                fileInputRef.current?.click();
                            }}
                            type="button"
                        >
                            <UploadIcon />
                            Upload files
                        </Button>
                    </EmptyContent>
                </Empty>
            ) : (
                <>
                    <MediaTable items={data.items} onDeleted={reloadPage} />
                    <MediaPagination
                        currentPage={data.pagination.page}
                        filters={data.filters}
                        totalPages={data.pagination.totalPages}
                    />
                </>
            )}
        </div>
    );
}
