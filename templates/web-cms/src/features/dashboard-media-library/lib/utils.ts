import {
    MAX_FILE_SIZE,
    MAX_VIDEO_FILE_SIZE,
} from "#/features/dashboard-media-library/lib/constants";
import {
    IMAGE_MIME_TYPES,
    SEEDED_MEDIA_KIND_BY_MIME_TYPE,
    SEEDED_MEDIA_MIME_TYPE_SET,
    VIDEO_MIME_TYPES,
} from "#/integrations/app/media-mime-types";
import type { MEDIA_MIME_TYPES, MediaKind } from "#/integrations/app/media-mime-types";

export function isSupportedMediaMimeType(
    value: string
): value is (typeof MEDIA_MIME_TYPES)[number] {
    return SEEDED_MEDIA_MIME_TYPE_SET.has(value);
}

export function getMediaKindForMimeType(mimeType: string): MediaKind | null {
    return SEEDED_MEDIA_KIND_BY_MIME_TYPE.get(mimeType) ?? null;
}

export function getMaxUploadSizeForMimeType(mimeType: string) {
    if ((IMAGE_MIME_TYPES as readonly string[]).includes(mimeType)) {
        return MAX_FILE_SIZE;
    }

    if ((VIDEO_MIME_TYPES as readonly string[]).includes(mimeType)) {
        return MAX_VIDEO_FILE_SIZE;
    }

    return null;
}

export function sanitizeStorageKeySegment(value: string) {
    const normalized = value
        .trim()
        .toLowerCase()
        .replaceAll(/[^a-z0-9.-]+/gu, "-")
        .replaceAll(/-+/gu, "-")
        .replaceAll(/^-|-$/gu, "");

    return normalized || "file";
}

export function slugifyTagName(value: string) {
    const normalized = value
        .trim()
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/gu, "-")
        .replaceAll(/-+/gu, "-")
        .replaceAll(/^-|-$/gu, "");

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

export function parseTagDraft(tagDraft: string) {
    return normalizeTagNames(tagDraft.split(/[\n,]+/u));
}
