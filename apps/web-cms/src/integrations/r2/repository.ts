import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createServerOnlyFn } from "@tanstack/react-start";

import { PRESIGNED_URL_EXPIRATION } from "#/integrations/r2/constants";
import type {
    GeneratePresignedDownloadUrlOptions,
    GeneratePresignedUploadUrlOptions,
    UploadTextContentOptions,
    IStorageRepository,
    GetTextContentOptions,
    DeleteTextContentOptions,
} from "#/integrations/r2/types";

export const storageRepository = {
    /**
     * Generate a presigned URL for uploading a file to R2
     */
    generatePresignedUploadUrl: createServerOnlyFn(
        async (client: S3Client, payload: GeneratePresignedUploadUrlOptions) => {
            const command = new PutObjectCommand({
                Bucket: payload.bucketName,
                Key: payload.key,
                ContentType: payload.contentType,
            });

            const url = await getSignedUrl(client, command, {
                expiresIn: payload.expiresIn || PRESIGNED_URL_EXPIRATION,
            });

            return {
                url,
            };
        }
    ),

    /**
     * Generate a presigned URL for downloading a file from R2
     */
    generatePresignedDownloadUrl: createServerOnlyFn(
        async (client: S3Client, payload: GeneratePresignedDownloadUrlOptions) => {
            const command = new GetObjectCommand({
                Bucket: payload.bucketName,
                Key: payload.key,
            });

            const url = await getSignedUrl(client, command, {
                expiresIn: payload.expiresIn || PRESIGNED_URL_EXPIRATION,
            });

            return {
                url,
            };
        }
    ),

    /**
     * Upload text content to R2
     */
    uploadTextContent: createServerOnlyFn(
        async (client: S3Client, payload: UploadTextContentOptions) => {
            const command = new PutObjectCommand({
                Bucket: payload.bucketName,
                Key: payload.key,
                Body: payload.content,
                ContentType: "text/html; charset=utf-8",
            });

            await client.send(command);
        }
    ),

    /**
     * Get text content from R2
     */
    getTextContent: createServerOnlyFn(async (client: S3Client, payload: GetTextContentOptions) => {
        const command = new GetObjectCommand({
            Bucket: payload.bucketName,
            Key: payload.key,
        });

        const response = await client.send(command);
        if (!response.Body) {
            return "";
        }

        const bytes = await response.Body.transformToByteArray();
        return new TextDecoder("utf-8").decode(bytes);
    }),

    /**
     * Delete an object from R2
     */
    deleteObject: createServerOnlyFn(
        async (client: S3Client, payload: DeleteTextContentOptions) => {
            const command = new DeleteObjectCommand({
                Bucket: payload.bucketName,
                Key: payload.key,
            });

            await client.send(command);
        }
    ),
} satisfies IStorageRepository;
