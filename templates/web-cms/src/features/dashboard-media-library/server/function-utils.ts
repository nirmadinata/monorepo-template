import { createServerOnlyFn } from "@tanstack/react-start";
import { and, asc, desc, eq, inArray, like } from "drizzle-orm";
import type * as v from "valibot";

import {
    MEDIA_LIBRARY_FILTER_KIND_VALUES,
    MEDIA_LIBRARY_KIND_ENUM,
} from "#/features/dashboard-media-library/lib/constants";
import type {
    MEDIA_LIBRARY_SEARCH_SCHEMA,
    MediaLibrarySearchValues,
} from "#/features/dashboard-media-library/lib/form-schema";
import {
    formatBytes,
    normalizeTagNames,
    sanitizeStorageKeySegment,
    slugifyTagName,
} from "#/features/dashboard-media-library/lib/utils";
import { getWorkerEnv } from "#/integrations/appenv/worker";
import { getCurrentSession } from "#/integrations/auth";
import { dbSchema, getDB } from "#/integrations/db";
import { getR2Client, storageRepository } from "#/integrations/r2";

type MediaLibraryPageInput = v.InferOutput<typeof MEDIA_LIBRARY_SEARCH_SCHEMA>;

export function normalizeOptionalText(value?: string | null) {
    const normalized = value?.trim();
    return normalized || null;
}

export function createStorageKey(kind: "image" | "video", fileName: string) {
    const date = new Date().toISOString().slice(0, 10);
    return `media/${kind}/${date}/${crypto.randomUUID()}-${sanitizeStorageKeySegment(fileName)}`;
}

export const requireMediaSession = createServerOnlyFn(async () => {
    const session = await getCurrentSession();

    if (!session?.user) {
        throw new Error("You must be signed in to manage media.");
    }

    return session;
});

export const getMediaLibraryDB = createServerOnlyFn(async () => {
    const env = await getWorkerEnv();
    return getDB(env.MAIN_DB);
});

export const listAvailableTags = createServerOnlyFn(async () => {
    const db = await getMediaLibraryDB();

    return db
        .select({
            id: dbSchema.tags.id,
            name: dbSchema.tags.name,
            slug: dbSchema.tags.slug,
        })
        .from(dbSchema.tags)
        .orderBy(asc(dbSchema.tags.name));
});

const resolveMimeTypeIdsForKind = createServerOnlyFn(
    async (kind: MediaLibraryPageInput["kind"]) => {
        if (!kind || kind === MEDIA_LIBRARY_KIND_ENUM.ALL) {
            return null;
        }

        const db = await getMediaLibraryDB();
        const mimeTypes = await db
            .select({ id: dbSchema.mimeTypes.id })
            .from(dbSchema.mimeTypes)
            .where(eq(dbSchema.mimeTypes.kind, kind));

        return mimeTypes.map((mimeType) => mimeType.id);
    }
);

const resolveMediaIdsForTag = createServerOnlyFn(async (tagSlug: string) => {
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
});

const getMediaTagsForMediaIds = createServerOnlyFn(async (mediaIds: number[]) => {
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
});

const getMimeTypeMap = createServerOnlyFn(async (ids: number[]) => {
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
});

const createSignedMediaUrl = createServerOnlyFn(async (storageKey: string) => {
    const client = getR2Client();
    const { url } = await storageRepository.generatePresignedDownloadUrl(client, {
        key: storageKey,
    });

    return url;
});

export const buildMediaPage = createServerOnlyFn(async (input: MediaLibraryPageInput) => {
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
});

const createEmptyMediaPage = createServerOnlyFn((input: MediaLibraryPageInput) => ({
    availableKinds: MEDIA_LIBRARY_FILTER_KIND_VALUES,
    availableTags: [] as { id: number; name: string; slug: string }[],
    filters: {
        kind: input.kind,
        page: input.page,
        pageSize: input.pageSize,
        search: input.search,
        tag: input.tag,
    } as MediaLibrarySearchValues,
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
}));

export const ensureTags = createServerOnlyFn(async (tagNames: string[], userId: string) => {
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
});

export const getMediaByStorageKey = createServerOnlyFn(async (storageKey: string) => {
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
});

export const getMediaById = createServerOnlyFn(async (mediaId: number) => {
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
});
