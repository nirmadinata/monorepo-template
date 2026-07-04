import type { S3mini } from "s3mini";

export type R2Client = S3mini;

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
