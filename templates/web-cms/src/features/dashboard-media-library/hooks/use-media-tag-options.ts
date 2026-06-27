import { useMemo } from "react";

import type { MediaLibraryPageData } from "#/features/dashboard-media-library/components/types";

export interface MediaTagOption {
    label: string;
    value: string;
}

export function useMediaTagOptions(data: MediaLibraryPageData): MediaTagOption[] {
    return useMemo(
        () => [
            { label: "All tags", value: "" },
            ...data.availableTags.map((tag) => ({
                label: tag.name,
                value: tag.slug,
            })),
        ],
        [data.availableTags]
    );
}
