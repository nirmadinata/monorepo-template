import type { S3mini } from "s3mini";

export type R2Client = S3mini;

/**
 * Repository of storage operations for R2
 */
export type IStorageRepository = Record<
    string,
    // oxlint-disable-next-line typescript/no-explicit-any
    (client: R2Client, ...args: any[]) => Promise<any>
>;

/**
 * Options for generating presigned URLs
 */
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
