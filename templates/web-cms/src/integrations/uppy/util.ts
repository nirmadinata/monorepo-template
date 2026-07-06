import type { Meta, Body, UppyFile } from "@uppy/core";

import { UPPY_UPLOAD_FOLDER } from "./constants";

export interface UploadedFileEntry {
    key: string;
    name: string;
    size: number;
    type: string;
    url: string;
}

function sanitizeFilename(name: string): string {
    return name
        .replaceAll(/[^a-zA-Z0-9._-]/gu, "-")
        .replaceAll(/-+/gu, "-")
        .replace(/^-|-$/u, "")
        .toLowerCase();
}

export function generateFileKey(folder?: string): string {
    const dir = folder ?? UPPY_UPLOAD_FOLDER;
    const timestamp = Date.now();
    const random = crypto.randomUUID().slice(0, 8);
    return `${dir}/${timestamp}-${random}`;
}

export function generateFullKey(folder: string | undefined, file: UppyFile<Meta, Body>): string {
    const baseKey = generateFileKey(folder);
    const ext = file.extension ? `.${file.extension}` : "";
    const safeName = sanitizeFilename(file.name ?? "file");
    return `${baseKey}-${safeName}${ext}`;
}

export function extractUploadedFileMetadata(
    file: UppyFile<Meta, Body>,
    key: string,
    downloadUrl: string
): UploadedFileEntry {
    return {
        key,
        name: file.name ?? "unknown",
        size: file.size ?? 0,
        type: file.type ?? "application/octet-stream",
        url: downloadUrl,
    };
}
