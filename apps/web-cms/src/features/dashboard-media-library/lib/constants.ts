/**
 * Maximum file size for uploads (10MB in bytes)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_MIME_TYPE_ENUM = {
    JPEG: "image/jpeg",
    PNG: "image/png",
    GIF: "image/gif",
    WEBP: "image/webp",
    SVG: "image/svg+xml",
} as const;
export const ALLOWED_IMAGE_MIME_TYPES = [
    ALLOWED_IMAGE_MIME_TYPE_ENUM.JPEG,
    ALLOWED_IMAGE_MIME_TYPE_ENUM.PNG,
    ALLOWED_IMAGE_MIME_TYPE_ENUM.GIF,
    ALLOWED_IMAGE_MIME_TYPE_ENUM.WEBP,
    ALLOWED_IMAGE_MIME_TYPE_ENUM.SVG,
] as const;

/**
 * Allowed video MIME types
 */
export const ALLOWED_VIDEO_MIME_TYPE_ENUM = {
    MP4: "video/mp4",
    WEBM: "video/webm",
    QUICKTIME: "video/quicktime",
} as const;
export const ALLOWED_VIDEO_MIME_TYPES = [
    ALLOWED_VIDEO_MIME_TYPE_ENUM.MP4,
    ALLOWED_VIDEO_MIME_TYPE_ENUM.WEBM,
    ALLOWED_VIDEO_MIME_TYPE_ENUM.QUICKTIME,
] as const;

/**
 * Allowed PDF MIME type
 */
export const ALLOWED_PDF_MIME_TYPE = "application/pdf" as const;

/**
 * Maximum PDF file size (50MB in bytes)
 */
export const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024;

export const ALLOWED_MEDIA_MIME_TYPES = [
    ...ALLOWED_IMAGE_MIME_TYPES,
    ...ALLOWED_VIDEO_MIME_TYPES,
] as const;

export const MEDIA_LIBRARY_PAGE_SIZE = 12;

export const MEDIA_LIBRARY_KIND_ENUM = {
    IMAGE: "image",
    VIDEO: "video",
    ALL: "all",
} as const;

export const MEDIA_LIBRARY_KIND_VALUES = [
    MEDIA_LIBRARY_KIND_ENUM.IMAGE,
    MEDIA_LIBRARY_KIND_ENUM.VIDEO,
] as const;

export const MEDIA_LIBRARY_FILTER_KIND_VALUES = [
    MEDIA_LIBRARY_KIND_ENUM.ALL,
    ...MEDIA_LIBRARY_KIND_VALUES,
] as const;

export const SEEDED_MEDIA_MIME_TYPES = [
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.IMAGE,
        mimeType: ALLOWED_IMAGE_MIME_TYPE_ENUM.JPEG,
        title: "JPEG image",
    },
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.IMAGE,
        mimeType: ALLOWED_IMAGE_MIME_TYPE_ENUM.PNG,
        title: "PNG image",
    },
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.IMAGE,
        mimeType: ALLOWED_IMAGE_MIME_TYPE_ENUM.GIF,
        title: "GIF image",
    },
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.IMAGE,
        mimeType: ALLOWED_IMAGE_MIME_TYPE_ENUM.WEBP,
        title: "WebP image",
    },
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.IMAGE,
        mimeType: ALLOWED_IMAGE_MIME_TYPE_ENUM.SVG,
        title: "SVG image",
    },
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.VIDEO,
        mimeType: ALLOWED_VIDEO_MIME_TYPE_ENUM.MP4,
        title: "MP4 video",
    },
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.VIDEO,
        mimeType: ALLOWED_VIDEO_MIME_TYPE_ENUM.WEBM,
        title: "WebM video",
    },
    {
        kind: MEDIA_LIBRARY_KIND_ENUM.VIDEO,
        mimeType: ALLOWED_VIDEO_MIME_TYPE_ENUM.QUICKTIME,
        title: "QuickTime video",
    },
] as const satisfies readonly {
    kind: MediaLibraryKind;
    mimeType: (typeof ALLOWED_MEDIA_MIME_TYPES)[number];
    title: string;
}[];

export const SEEDED_MEDIA_MIME_TYPE_SET = new Set<string>(
    SEEDED_MEDIA_MIME_TYPES.map((mime) => mime.mimeType)
);

export const SEEDED_MEDIA_KIND_BY_MIME_TYPE = new Map<string, MediaLibraryKind>(
    SEEDED_MEDIA_MIME_TYPES.map((mime) => [mime.mimeType, mime.kind])
);

export type SeededMediaMimeType = (typeof SEEDED_MEDIA_MIME_TYPES)[number]["mimeType"];
export type SeededMediaKind = (typeof SEEDED_MEDIA_MIME_TYPES)[number]["kind"];
export type MediaLibraryKind = (typeof MEDIA_LIBRARY_KIND_VALUES)[number];
export type MediaLibraryFilterKind = (typeof MEDIA_LIBRARY_FILTER_KIND_VALUES)[number];
