import { MEDIA_KIND } from "#/integrations/app/media-mime-types";

/**
 * Maximum file size for uploads (10MB in bytes)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Maximum video file size (100MB in bytes)
 */
export const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024;

/**
 * Allowed PDF MIME type
 */
export const ALLOWED_PDF_MIME_TYPE = "application/pdf" as const;

/**
 * Maximum PDF file size (50MB in bytes)
 */
export const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024;

export const MEDIA_LIBRARY_PAGE_SIZE = 12;

export const MEDIA_LIBRARY_KIND_ENUM = {
    ALL: "all",
    IMAGE: MEDIA_KIND.IMAGE,
    VIDEO: MEDIA_KIND.VIDEO,
} as const;

export const MEDIA_LIBRARY_KIND_VALUES = [
    MEDIA_LIBRARY_KIND_ENUM.IMAGE,
    MEDIA_LIBRARY_KIND_ENUM.VIDEO,
] as const;

export const MEDIA_LIBRARY_FILTER_KIND_VALUES = [
    MEDIA_LIBRARY_KIND_ENUM.ALL,
    ...MEDIA_LIBRARY_KIND_VALUES,
] as const;

export type MediaLibraryKind = (typeof MEDIA_LIBRARY_KIND_VALUES)[number];
export type MediaLibraryFilterKind = (typeof MEDIA_LIBRARY_FILTER_KIND_VALUES)[number];
