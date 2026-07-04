import { createServerOnlyFn } from "@tanstack/react-start";

import { PRESIGNED_URL_EXPIRATION } from "#/integrations/constants/r2";
import type {
    GeneratePresignedDownloadUrlOptions,
    GeneratePresignedUploadUrlOptions,
    UploadTextContentOptions,
    IStorageRepository,
    GetTextContentOptions,
    DeleteTextContentOptions,
    R2Client,
} from "#/integrations/lib/r2/types";

export const storageRepository = {
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

    uploadTextContent: createServerOnlyFn(
        async (client: R2Client, payload: UploadTextContentOptions) => {
            const { ok } = await client.putObject(payload.key, payload.content);
            return { ok };
        }
    ),

    getTextContent: createServerOnlyFn(async (client: R2Client, payload: GetTextContentOptions) => {
        const response = await client.getObject(payload.key);
        return response;
    }),

    deleteObject: createServerOnlyFn(
        async (client: R2Client, payload: DeleteTextContentOptions) => {
            const ok = await client.deleteObject(payload.key);
            return { ok };
        }
    ),
} satisfies IStorageRepository;
