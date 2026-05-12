import { ImageIcon, VideoIcon } from "lucide-react";

import type { MediaLibraryItem } from "../types";

export function MediaPreview({ item }: { item: MediaLibraryItem }) {
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
