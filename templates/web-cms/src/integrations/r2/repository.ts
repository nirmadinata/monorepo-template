import { createServerOnlyFn } from "@tanstack/react-start";

import { PRESIGNED_URL_EXPIRATION } from "#/integrations/r2/constants";
import type {
    GeneratePresignedDownloadUrlOptions,
    GeneratePresignedUploadUrlOptions,
    UploadTextContentOptions,
    IStorageRepository,
    GetTextContentOptions,
    DeleteTextContentOptions,
    R2Client,
} from "#/integrations/r2/types";

export const storageRepository = {
    /**
     * Generate a presigned URL for uploading a file to R2
     */
    generatePresignedUploadUrl: createServerOnlyFn(
        async (client: R2Client, payload: GeneratePresignedUploadUrlOptions) => {
            const url = await client.getPresignedUrl(
                "PUT",
                payload.key,
                payload.expiresIn || PRESIGNED_URL_EXPIRATION
            );

            return { url };
        }
    ),

    /**
     * Generate a presigned URL for downloading a file from R2
     */
    generatePresignedDownloadUrl: createServerOnlyFn(
        async (client: R2Client, payload: GeneratePresignedDownloadUrlOptions) => {
            const url = await client.getPresignedUrl(
                "GET",
                payload.key,
                payload.expiresIn || PRESIGNED_URL_EXPIRATION
            );

            return { url };
        }
    ),

    /**
     * Upload text content to R2
     */
    uploadTextContent: createServerOnlyFn(
        async (client: R2Client, payload: UploadTextContentOptions) => {
            const { ok } = await client.putObject(payload.key, payload.content);
            return { ok };
        }
    ),

    /**
     * Get text content from R2
     */
    getTextContent: createServerOnlyFn(async (client: R2Client, payload: GetTextContentOptions) => {
        const response = await client.getObject(payload.key);
        return response;
    }),

    /**
     * Delete an object from R2
     */
    deleteObject: createServerOnlyFn(
        async (client: R2Client, payload: DeleteTextContentOptions) => {
            const ok = await client.deleteObject(payload.key);
            return { ok };
        }
    ),
} satisfies IStorageRepository;
