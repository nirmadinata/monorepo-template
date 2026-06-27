import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import {
    formatBytes,
    getMaxUploadSizeForMimeType,
    getMediaKindForMimeType,
    isSupportedMediaMimeType,
} from "#/features/dashboard-media-library/lib/utils";
import {
    deleteMediaInputSchema,
    finalizeUploadInputSchema,
    updateMediaTagsInputSchema,
    uploadIntentInputSchema,
} from "#/features/dashboard-media-library/server/function-schemas";
import {
    requireMediaSession,
    buildMediaPage,
    createStorageKey,
    getMediaLibraryDB,
    getMediaByStorageKey,
    normalizeOptionalText,
    ensureTags,
    getMediaById,
} from "#/features/dashboard-media-library/server/function-utils";
import { dbSchema } from "#/integrations/db";
import { getR2Client } from "#/integrations/r2/client";
import { storageRepository } from "#/integrations/r2/repository";

import { MEDIA_LIBRARY_SEARCH_SCHEMA } from "../lib/form-schema";

export const getMediaLibraryPage = createServerFn({ method: "GET" })
    .validator(MEDIA_LIBRARY_SEARCH_SCHEMA)
    .handler(async ({ data }) => {
        await requireMediaSession();
        return buildMediaPage(data);
    });

export const requestMediaUploadIntent = createServerFn({ method: "POST" })
    .validator(uploadIntentInputSchema)
    .handler(async ({ data }) => {
        await requireMediaSession();

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
    .validator(finalizeUploadInputSchema)
    .handler(async ({ data }) => {
        const session = await requireMediaSession();
        const db = await getMediaLibraryDB();

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
    .validator(updateMediaTagsInputSchema)
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
    .validator(deleteMediaInputSchema)
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
