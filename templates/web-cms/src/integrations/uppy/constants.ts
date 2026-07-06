/**
 * Uppy file upload constraints and defaults.
 */

// 10MB
export const UPPY_MAX_FILE_SIZE = 10 * 1024 * 1024;

export const UPPY_MAX_FILES = 5;

export const UPPY_ALLOWED_FILE_TYPES = [
    "image/*",
    "application/pdf",
    "video/*",
    "audio/*",
    "application/zip",
    "application/x-zip-compressed",
];

export const UPPY_UPLOAD_FOLDER = "uploads";

// 1 hour
export const UPPY_PRESIGNED_URL_EXPIRATION = 3600;
