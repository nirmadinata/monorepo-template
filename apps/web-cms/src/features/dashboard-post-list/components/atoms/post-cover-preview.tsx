import { ImageIcon } from "lucide-react";

import type { PostListItem } from "../types";

export function PostCoverPreview({ item }: { item: PostListItem }) {
    if (item.coverUrl && item.coverKind === "image") {
        return (
            <img
                alt={item.coverAltText || item.title || "Post cover image"}
                className="size-12 rounded-lg object-cover ring-1 ring-border/80"
                src={item.coverUrl}
            />
        );
    }

    return (
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/80">
            <ImageIcon className="size-5 text-muted-foreground" />
        </div>
    );
}
