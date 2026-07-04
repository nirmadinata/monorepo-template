import { createServerOnlyFn } from "@tanstack/react-start";

import type { R2Client } from "./clients";
import { PRESIGNED_URL_EXPIRATION } from "./constants";

// oxlint-disable-next-line typescript/no-explicit-any
export type IStorageRepository = Record<string, (client: R2Client, ...args: any[]) => Promise<any>>;

export interface GeneratePresignedUploadUrlOptions {
    key: string;
    contentType: string;
    contentLength?: number;
    expiresIn?: number;
}

export type GeneratePresignedDownloadUrlOptions = Omit<
    GeneratePresignedUploadUrlOptions,
    "contentType"
>;

export interface UploadTextContentOptions {
    key: string;
    content: string;
}

export interface GetTextContentOptions {
    key: string;
}

export type DeleteTextContentOptions = GetTextContentOptions;

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
