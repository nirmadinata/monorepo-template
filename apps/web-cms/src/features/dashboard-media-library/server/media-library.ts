import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, inArray, like } from "drizzle-orm";
import { z } from "zod";

import { getWorkerEnv } from "#/integrations/appenv/worker";
import { getCurrentSession } from "#/integrations/auth";
import { dbSchema, getAppDB } from "#/integrations/db";
import { getR2Client } from "#/integrations/r2/client";
import { storageRepository } from "#/integrations/r2/repository";

import {
    MEDIA_LIBRARY_FILTER_KIND_VALUES,
    MEDIA_LIBRARY_PAGE_SIZE,
    SEEDED_MEDIA_MIME_TYPES,
    formatBytes,
    getMaxUploadSizeForMimeType,
    getMediaKindForMimeType,
    isSupportedMediaMimeType,
    normalizeTagNames,
    sanitizeStorageKeySegment,
    slugifyTagName,
} from "../lib/media-library";

const mediaLibraryPageInputSchema = z.object({
    kind: z.enum(MEDIA_LIBRARY_FILTER_KIND_VALUES).default("all"),
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(50).default(MEDIA_LIBRARY_PAGE_SIZE),
    search: z.string().trim().max(100).default(""),
    tag: z.string().trim().max(100).default(""),
});

const uploadIntentInputSchema = z.object({
    fileName: z.string().trim().min(1).max(255),
    fileSize: z.number().int().positive(),
    mimeType: z.string().trim().min(1),
});

const finalizeUploadInputSchema = z.object({
    description: z.string().trim().max(500).optional().default(""),
    durationSeconds: z.number().int().nonnegative().nullable().optional(),
    height: z.number().int().nonnegative().nullable().optional(),
    imageAltText: z.string().trim().max(255).optional().default(""),
    mimeType: z.string().trim().min(1),
    name: z.string().trim().max(255).optional().default(""),
    originalFilename: z.string().trim().min(1).max(255),
    sizeInBytes: z.number().int().positive(),
    storageKey: z.string().trim().min(1),
    tagNames: z.array(z.string().trim()).default([]),
    width: z.number().int().nonnegative().nullable().optional(),
});

const updateMediaTagsInputSchema = z.object({
    mediaId: z.number().int().positive(),
    tagNames: z.array(z.string().trim()).default([]),
});

const deleteMediaInputSchema = z.object({
    mediaId: z.number().int().positive(),
});

type MediaLibraryPageInput = z.infer<typeof mediaLibraryPageInputSchema>;

function normalizeOptionalText(value?: string | null) {
    const normalized = value?.trim();
    return normalized || null;
}

function createStorageKey(kind: "image" | "video", fileName: string) {
    const date = new Date().toISOString().slice(0, 10);
    return `media/${kind}/${date}/${crypto.randomUUID()}-${sanitizeStorageKeySegment(fileName)}`;
}

async function requireMediaSession() {
    const session = await getCurrentSession();

    if (!session?.user) {
        throw new Error("You must be signed in to manage media.");
    }

    return session;
}

async function getMediaLibraryDB() {
    const env = await getWorkerEnv();
    return getAppDB(env.MAIN_DB);
}

async function ensureMediaMimeTypesSeeded(userId?: string) {
    const db = await getMediaLibraryDB();

    await db
        .insert(dbSchema.mimeTypes)
        .values(
            SEEDED_MEDIA_MIME_TYPES.map((mimeType) => ({
                createdBy: userId ?? null,
                description: null,
                kind: mimeType.kind,
                mimeType: mimeType.mimeType,
                title: mimeType.title,
                updatedBy: userId ?? null,
            }))
        )
        .onConflictDoNothing();

    return db;
}

async function listAvailableTags() {
    const db = await getMediaLibraryDB();

    return db
        .select({
            id: dbSchema.tags.id,
            name: dbSchema.tags.name,
            slug: dbSchema.tags.slug,
        })
        .from(dbSchema.tags)
        .orderBy(asc(dbSchema.tags.name));
}

async function resolveMimeTypeIdsForKind(kind: MediaLibraryPageInput["kind"]) {
    if (kind === "all") {
        return null;
    }

    const db = await getMediaLibraryDB();
    const mimeTypes = await db
        .select({ id: dbSchema.mimeTypes.id })
        .from(dbSchema.mimeTypes)
        .where(eq(dbSchema.mimeTypes.kind, kind));

    return mimeTypes.map((mimeType) => mimeType.id);
}

async function resolveMediaIdsForTag(tagSlug: string) {
    if (!tagSlug) {
        return null;
    }

    const db = await getMediaLibraryDB();
    const [tag] = await db
        .select({ id: dbSchema.tags.id })
        .from(dbSchema.tags)
        .where(eq(dbSchema.tags.slug, tagSlug))
        .limit(1);

    if (!tag) {
        return [];
    }

    const mediaTags = await db
        .select({ mediaId: dbSchema.mediaTags.mediaId })
        .from(dbSchema.mediaTags)
        .where(eq(dbSchema.mediaTags.tagId, tag.id));

    return mediaTags.map((mediaTag) => mediaTag.mediaId);
}

async function getMediaTagsForMediaIds(mediaIds: number[]) {
    if (mediaIds.length === 0) {
        return new Map<number, { id: number; name: string; slug: string }[]>();
    }

    const db = await getMediaLibraryDB();
    const rows = await db
        .select({
            mediaId: dbSchema.mediaTags.mediaId,
            tagId: dbSchema.tags.id,
            tagName: dbSchema.tags.name,
            tagSlug: dbSchema.tags.slug,
        })
        .from(dbSchema.mediaTags)
        .innerJoin(dbSchema.tags, eq(dbSchema.mediaTags.tagId, dbSchema.tags.id))
        .where(inArray(dbSchema.mediaTags.mediaId, mediaIds))
        .orderBy(asc(dbSchema.tags.name));

    const map = new Map<number, { id: number; name: string; slug: string }[]>();

    for (const row of rows) {
        const tags = map.get(row.mediaId) ?? [];
        tags.push({
            id: row.tagId,
            name: row.tagName,
            slug: row.tagSlug,
        });
        map.set(row.mediaId, tags);
    }

    return map;
}

async function getMimeTypeMap(ids: number[]) {
    if (ids.length === 0) {
        return new Map<number, { kind: string; mimeType: string; title: string | null }>();
    }

    const db = await getMediaLibraryDB();
    const rows = await db
        .select({
            id: dbSchema.mimeTypes.id,
            kind: dbSchema.mimeTypes.kind,
            mimeType: dbSchema.mimeTypes.mimeType,
            title: dbSchema.mimeTypes.title,
        })
        .from(dbSchema.mimeTypes)
        .where(inArray(dbSchema.mimeTypes.id, ids));

    return new Map(rows.map((row) => [row.id, row]));
}

async function createSignedMediaUrl(storageKey: string) {
    const client = getR2Client();
    const { url } = await storageRepository.generatePresignedDownloadUrl(client, {
        key: storageKey,
    });

    return url;
}

async function buildMediaPage(input: MediaLibraryPageInput) {
    const db = await getMediaLibraryDB();
    const filters = [];
    const mimeTypeIds = await resolveMimeTypeIdsForKind(input.kind);
    const mediaIdsForTag = await resolveMediaIdsForTag(input.tag);

    if (mimeTypeIds && mimeTypeIds.length === 0) {
        return createEmptyMediaPage(input);
    }

    if (mediaIdsForTag && mediaIdsForTag.length === 0) {
        return createEmptyMediaPage(input);
    }

    if (mimeTypeIds) {
        filters.push(inArray(dbSchema.medias.mimeTypeId, mimeTypeIds));
    }

    if (mediaIdsForTag) {
        filters.push(inArray(dbSchema.medias.id, mediaIdsForTag));
    }

    if (input.search) {
        filters.push(like(dbSchema.medias.name, `%${input.search}%`));
    }

    const where = filters.length > 0 ? and(...filters) : undefined;
    const totalItems = await db.$count(dbSchema.medias, where);
    const totalPages = Math.max(1, Math.ceil(totalItems / input.pageSize));
    const page = Math.min(input.page, totalPages);
    const offset = (page - 1) * input.pageSize;

    const rows = await db
        .select({
            createdAt: dbSchema.medias.createdAt,
            description: dbSchema.medias.description,
            durationSeconds: dbSchema.medias.durationSeconds,
            height: dbSchema.medias.height,
            id: dbSchema.medias.id,
            imageAltText: dbSchema.medias.imageAltText,
            mimeTypeId: dbSchema.medias.mimeTypeId,
            name: dbSchema.medias.name,
            originalFilename: dbSchema.medias.originalFilename,
            sizeInBytes: dbSchema.medias.sizeInBytes,
            storageKey: dbSchema.medias.storageKey,
            width: dbSchema.medias.width,
        })
        .from(dbSchema.medias)
        .where(where)
        .orderBy(desc(dbSchema.medias.createdAt), desc(dbSchema.medias.id))
        .limit(input.pageSize)
        .offset(offset);

    const mimeTypeMap = await getMimeTypeMap(rows.map((row) => row.mimeTypeId));
    const mediaTagsMap = await getMediaTagsForMediaIds(rows.map((row) => row.id));
    const availableTags = await listAvailableTags();
    const items = await Promise.all(
        rows.map(async (row) => {
            const mimeType = mimeTypeMap.get(row.mimeTypeId);
            const tags = mediaTagsMap.get(row.id) ?? [];

            try {
                const previewUrl = await createSignedMediaUrl(row.storageKey);

                return {
                    createdAt: row.createdAt instanceof Date ? row.createdAt.getTime() : null,
                    description: row.description,
                    durationSeconds: row.durationSeconds,
                    fileSizeLabel: formatBytes(row.sizeInBytes),
                    height: row.height,
                    id: row.id,
                    imageAltText: row.imageAltText,
                    kind: mimeType?.kind ?? "image",
                    mimeType: mimeType?.mimeType ?? "application/octet-stream",
                    name: row.name,
                    originalFilename: row.originalFilename,
                    previewError: false,
                    previewUrl,
                    sizeInBytes: row.sizeInBytes,
                    tags,
                    width: row.width,
                };
            } catch {
                return {
                    createdAt: row.createdAt instanceof Date ? row.createdAt.getTime() : null,
                    description: row.description,
                    durationSeconds: row.durationSeconds,
                    fileSizeLabel: formatBytes(row.sizeInBytes),
                    height: row.height,
                    id: row.id,
                    imageAltText: row.imageAltText,
                    kind: mimeType?.kind ?? "image",
                    mimeType: mimeType?.mimeType ?? "application/octet-stream",
                    name: row.name,
                    originalFilename: row.originalFilename,
                    previewError: true,
                    previewUrl: null,
                    sizeInBytes: row.sizeInBytes,
                    tags,
                    width: row.width,
                };
            }
        })
    );

    return {
        availableKinds: MEDIA_LIBRARY_FILTER_KIND_VALUES,
        availableTags,
        filters: {
            kind: input.kind,
            page,
            pageSize: input.pageSize,
            search: input.search,
            tag: input.tag,
        },
        items,
        pagination: {
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            page,
            pageSize: input.pageSize,
            totalItems,
            totalPages,
        },
    };
}

function createEmptyMediaPage(input: MediaLibraryPageInput) {
    return {
        availableKinds: MEDIA_LIBRARY_FILTER_KIND_VALUES,
        availableTags: [] as { id: number; name: string; slug: string }[],
        filters: {
            kind: input.kind,
            page: input.page,
            pageSize: input.pageSize,
            search: input.search,
            tag: input.tag,
        },
        items: [] as {
            createdAt: number | null;
            description: string | null;
            durationSeconds: number | null;
            fileSizeLabel: string;
            height: number | null;
            id: number;
            imageAltText: string | null;
            kind: string;
            mimeType: string;
            name: string | null;
            originalFilename: string | null;
            previewError: boolean;
            previewUrl: string | null;
            sizeInBytes: number;
            tags: { id: number; name: string; slug: string }[];
            width: number | null;
        }[],
        pagination: {
            hasNextPage: false,
            hasPreviousPage: input.page > 1,
            page: input.page,
            pageSize: input.pageSize,
            totalItems: 0,
            totalPages: 1,
        },
    };
}

async function ensureTags(tagNames: string[], userId: string) {
    const normalizedTagNames = normalizeTagNames(tagNames);

    if (normalizedTagNames.length === 0) {
        return [] as { id: number; name: string; slug: string }[];
    }

    const db = await getMediaLibraryDB();

    await db
        .insert(dbSchema.tags)
        .values(
            normalizedTagNames.map((tagName) => ({
                createdBy: userId,
                name: tagName,
                slug: `${slugifyTagName(tagName)}-${crypto.randomUUID().slice(0, 8)}`,
                updatedBy: userId,
            }))
        )
        .onConflictDoNothing();

    return db
        .select({
            id: dbSchema.tags.id,
            name: dbSchema.tags.name,
            slug: dbSchema.tags.slug,
        })
        .from(dbSchema.tags)
        .where(inArray(dbSchema.tags.name, normalizedTagNames));
}

async function getMediaByStorageKey(storageKey: string) {
    const db = await getMediaLibraryDB();
    const [media] = await db
        .select({
            createdAt: dbSchema.medias.createdAt,
            description: dbSchema.medias.description,
            durationSeconds: dbSchema.medias.durationSeconds,
            height: dbSchema.medias.height,
            id: dbSchema.medias.id,
            imageAltText: dbSchema.medias.imageAltText,
            mimeTypeId: dbSchema.medias.mimeTypeId,
            name: dbSchema.medias.name,
            originalFilename: dbSchema.medias.originalFilename,
            sizeInBytes: dbSchema.medias.sizeInBytes,
            storageKey: dbSchema.medias.storageKey,
            width: dbSchema.medias.width,
        })
        .from(dbSchema.medias)
        .where(eq(dbSchema.medias.storageKey, storageKey))
        .limit(1);

    return media ?? null;
}

async function getMediaById(mediaId: number) {
    const db = await getMediaLibraryDB();
    const [media] = await db
        .select({
            id: dbSchema.medias.id,
            storageKey: dbSchema.medias.storageKey,
        })
        .from(dbSchema.medias)
        .where(eq(dbSchema.medias.id, mediaId))
        .limit(1);

    return media ?? null;
}

export const getMediaLibraryPage = createServerFn({ method: "GET" })
    .inputValidator(mediaLibraryPageInputSchema)
    .handler(async ({ data }) => {
        const session = await requireMediaSession();
        await ensureMediaMimeTypesSeeded(session.user.id);
        return buildMediaPage(data);
    });

export const requestMediaUploadIntent = createServerFn({ method: "POST" })
    .inputValidator(uploadIntentInputSchema)
    .handler(async ({ data }) => {
        const session = await requireMediaSession();
        await ensureMediaMimeTypesSeeded(session.user.id);

        if (!isSupportedMediaMimeType(data.mimeType)) {
            throw new Error("This file type is not supported by the media library.");
        }

        const maxFileSize = getMaxUploadSizeForMimeType(data.mimeType);

        if (!maxFileSize) {
            throw new Error("This file type is not supported by the media library.");
        }

        if (data.fileSize > maxFileSize) {
            throw new Error(`This file exceeds the ${formatBytes(maxFileSize)} upload limit.`);
        }

        const kind = getMediaKindForMimeType(data.mimeType);

        if (!kind) {
            throw new Error("Unable to resolve a media kind for this upload.");
        }

        const storageKey = createStorageKey(kind, data.fileName);
        const client = getR2Client();
        const { url } = await storageRepository
            .generatePresignedUploadUrl(client, { contentType: data.mimeType, key: storageKey })
            .catch((error) => {
                console.error("Error generating presigned upload URL:", error);

                return { url: "" };
            });

        return {
            kind,
            maxFileSize,
            mimeType: data.mimeType,
            storageKey,
            uploadUrl: url,
        };
    });

export const finalizeMediaUpload = createServerFn({ method: "POST" })
    .inputValidator(finalizeUploadInputSchema)
    .handler(async ({ data }) => {
        const session = await requireMediaSession();
        const db = await ensureMediaMimeTypesSeeded(session.user.id);

        const existingMedia = await getMediaByStorageKey(data.storageKey);

        if (existingMedia) {
            return existingMedia;
        }

        const [mimeType] = await db
            .select({
                id: dbSchema.mimeTypes.id,
                kind: dbSchema.mimeTypes.kind,
                mimeType: dbSchema.mimeTypes.mimeType,
            })
            .from(dbSchema.mimeTypes)
            .where(eq(dbSchema.mimeTypes.mimeType, data.mimeType))
            .limit(1);

        if (!mimeType) {
            throw new Error("Unable to resolve the MIME type for this upload.");
        }

        await db.insert(dbSchema.medias).values({
            createdBy: session.user.id,
            description: normalizeOptionalText(data.description),
            durationSeconds: data.durationSeconds ?? null,
            height: data.height ?? null,
            imageAltText:
                mimeType.kind === "image" ? normalizeOptionalText(data.imageAltText) : null,
            mimeTypeId: mimeType.id,
            name: normalizeOptionalText(data.name) ?? data.originalFilename,
            originalFilename: data.originalFilename,
            sizeInBytes: data.sizeInBytes,
            storageKey: data.storageKey,
            updatedBy: session.user.id,
            width: data.width ?? null,
        });

        const media = await getMediaByStorageKey(data.storageKey);

        if (!media) {
            throw new Error("Unable to load the finalized media record.");
        }

        const tags = await ensureTags(data.tagNames, session.user.id);

        if (tags.length > 0) {
            await db
                .insert(dbSchema.mediaTags)
                .values(
                    tags.map((tag) => ({
                        mediaId: media.id,
                        tagId: tag.id,
                    }))
                )
                .onConflictDoNothing();
        }

        return media;
    });

export const updateMediaTags = createServerFn({ method: "POST" })
    .inputValidator(updateMediaTagsInputSchema)
    .handler(async ({ data }) => {
        const session = await requireMediaSession();
        const db = await getMediaLibraryDB();
        const media = await getMediaById(data.mediaId);

        if (!media) {
            throw new Error("The selected media asset no longer exists.");
        }

        const tags = await ensureTags(data.tagNames, session.user.id);

        await db.delete(dbSchema.mediaTags).where(eq(dbSchema.mediaTags.mediaId, data.mediaId));

        if (tags.length > 0) {
            await db
                .insert(dbSchema.mediaTags)
                .values(
                    tags.map((tag) => ({
                        mediaId: data.mediaId,
                        tagId: tag.id,
                    }))
                )
                .onConflictDoNothing();
        }

        return {
            mediaId: data.mediaId,
            tags,
        };
    });

export const deleteMediaAsset = createServerFn({ method: "POST" })
    .inputValidator(deleteMediaInputSchema)
    .handler(async ({ data }) => {
        await requireMediaSession();
        const db = await getMediaLibraryDB();
        const media = await getMediaById(data.mediaId);

        if (!media) {
            return {
                deleted: false,
                notFound: true,
            };
        }

        const client = getR2Client();

        try {
            await storageRepository.deleteObject(client, { key: media.storageKey });
        } catch (error) {
            console.error("Error deleting media file from storage:", error);
        } finally {
            await db.delete(dbSchema.medias).where(eq(dbSchema.medias.id, data.mediaId));
        }

        return {
            deleted: true,
            notFound: false,
        };
    });
