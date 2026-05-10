import type { S3Client } from "@aws-sdk/client-s3";

/**
 * R2 Client Configuration
 */
export interface R2Config {
    bucketName: string;
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
}

/**
 * Repository of storage operations for R2
 */
export type IStorageRepository = Record<
    string,
    // oxlint-disable-next-line typescript/no-explicit-any
    (client: S3Client, ...args: any[]) => Promise<any>
>;

/**
 * Options for generating presigned URLs
 */
export interface GeneratePresignedUploadUrlOptions {
    key: string;
    contentType: string;
    contentLength?: number;
    bucketName: string;
    expiresIn?: number;
}

export type GeneratePresignedDownloadUrlOptions = Omit<
    GeneratePresignedUploadUrlOptions,
    "contentType"
>;

export interface UploadTextContentOptions {
    key: string;
    content: string;
    bucketName: string;
}

export interface GetTextContentOptions {
    key: string;
    bucketName: string;
}

export type DeleteTextContentOptions = GetTextContentOptions;
