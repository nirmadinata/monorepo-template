/**
 * Presigned URL expiration time in seconds (1 hour)
 */
export const PRESIGNED_URL_EXPIRATION = 3600;

/**
 * Maximum file size for uploads (10MB in bytes)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
] as const;

/**
 * Allowed video MIME types
 */
export const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;

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
