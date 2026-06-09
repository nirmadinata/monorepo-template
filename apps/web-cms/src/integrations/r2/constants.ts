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
