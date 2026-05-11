import {
    ALLOWED_IMAGE_MIME_TYPES,
    ALLOWED_VIDEO_MIME_TYPES,
    MAX_FILE_SIZE,
    MAX_VIDEO_FILE_SIZE,
} from "#/integrations/r2/constants";
import type { ALLOWED_MEDIA_MIME_TYPES } from "#/integrations/r2/constants";

export const MEDIA_LIBRARY_PAGE_SIZE = 12;

export const MEDIA_LIBRARY_KIND_VALUES = ["image", "video"] as const;

export type MediaLibraryKind = (typeof MEDIA_LIBRARY_KIND_VALUES)[number];

export const MEDIA_LIBRARY_FILTER_KIND_VALUES = ["all", ...MEDIA_LIBRARY_KIND_VALUES] as const;

export type MediaLibraryFilterKind = (typeof MEDIA_LIBRARY_FILTER_KIND_VALUES)[number];

export const SEEDED_MEDIA_MIME_TYPES = [
    {
        kind: "image",
        mimeType: "image/jpeg",
        title: "JPEG image",
    },
    {
        kind: "image",
        mimeType: "image/png",
        title: "PNG image",
    },
    {
        kind: "image",
        mimeType: "image/gif",
        title: "GIF image",
    },
    {
        kind: "image",
        mimeType: "image/webp",
        title: "WebP image",
    },
    {
        kind: "image",
        mimeType: "image/svg+xml",
        title: "SVG image",
    },
    {
        kind: "video",
        mimeType: "video/mp4",
        title: "MP4 video",
    },
    {
        kind: "video",
        mimeType: "video/webm",
        title: "WebM video",
    },
    {
        kind: "video",
        mimeType: "video/quicktime",
        title: "QuickTime video",
    },
] as const satisfies readonly {
    kind: MediaLibraryKind;
    mimeType: (typeof ALLOWED_MEDIA_MIME_TYPES)[number];
    title: string;
}[];

const SEEDED_MEDIA_MIME_TYPE_SET = new Set<string>(
    SEEDED_MEDIA_MIME_TYPES.map((mime) => mime.mimeType)
);

const SEEDED_MEDIA_KIND_BY_MIME_TYPE = new Map<string, MediaLibraryKind>(
    SEEDED_MEDIA_MIME_TYPES.map((mime) => [mime.mimeType, mime.kind])
);

export function isSupportedMediaMimeType(
    value: string
): value is (typeof ALLOWED_MEDIA_MIME_TYPES)[number] {
    return SEEDED_MEDIA_MIME_TYPE_SET.has(value);
}

export function getMediaKindForMimeType(mimeType: string): MediaLibraryKind | null {
    return SEEDED_MEDIA_KIND_BY_MIME_TYPE.get(mimeType) ?? null;
}

export function getMaxUploadSizeForMimeType(mimeType: string) {
    if ((ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType)) {
        return MAX_FILE_SIZE;
    }

    if ((ALLOWED_VIDEO_MIME_TYPES as readonly string[]).includes(mimeType)) {
        return MAX_VIDEO_FILE_SIZE;
    }

    return null;
}

export function sanitizeStorageKeySegment(value: string) {
    const normalized = value
        .trim()
        .toLowerCase()
        .replaceAll(/[^a-z0-9.-]+/g, "-")
        .replaceAll(/-+/g, "-")
        .replaceAll(/^-|-$/g, "");

    return normalized || "file";
}

export function slugifyTagName(value: string) {
    const normalized = value
        .trim()
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "-")
        .replaceAll(/-+/g, "-")
        .replaceAll(/^-|-$/g, "");

    return normalized || `tag-${crypto.randomUUID().slice(0, 8)}`;
}

export function normalizeTagNames(values: readonly string[]) {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function formatBytes(sizeInBytes: number) {
    if (sizeInBytes < 1024) {
        return `${sizeInBytes} B`;
    }

    const units = ["KB", "MB", "GB", "TB"];
    let value = sizeInBytes / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    const digits = value >= 10 ? 0 : 1;
    return `${value.toFixed(digits)} ${units[unitIndex]}`;
}
