import type { MediaLibraryItem } from "#/features/dashboard-media-library/components/types";

export function getMediaDisplayName(item: MediaLibraryItem) {
    return item.name || item.originalFilename || `Media #${item.id}`;
}
