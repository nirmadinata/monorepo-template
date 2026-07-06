import { createClientOnlyFn, createServerFn } from "@tanstack/react-start";
import { Uppy } from "@uppy/core";
import * as v from "valibot";

import { getR2Client } from "#/integrations/r2/clients";
import { storageRepository } from "#/integrations/r2/repository";

import { UPPY_PRESIGNED_URL_EXPIRATION } from "./constants";

export const createBaseUppy = createClientOnlyFn(
    () =>
        new Uppy({
            autoProceed: true,
        })
);

const presignedUploadUrlSchema = v.object({
    key: v.pipe(v.string(), v.nonEmpty()),
    contentType: v.pipe(v.string(), v.nonEmpty()),
});

const presignedDownloadUrlSchema = v.object({
    key: v.pipe(v.string(), v.nonEmpty()),
});

export const getPresignedUploadUrl = createServerFn({ method: "POST" })
    .validator(presignedUploadUrlSchema)
    .handler(async ({ data }) => {
        const result = await storageRepository.generatePresignedUploadUrl(getR2Client(), {
            key: data.key,
            contentType: data.contentType,
            expiresIn: UPPY_PRESIGNED_URL_EXPIRATION,
        });
        return result;
    });

export const getPresignedDownloadUrl = createServerFn({ method: "POST" })
    .validator(presignedDownloadUrlSchema)
    .handler(async ({ data }) => {
        const result = await storageRepository.generatePresignedDownloadUrl(getR2Client(), {
            key: data.key,
            expiresIn: UPPY_PRESIGNED_URL_EXPIRATION,
        });
        return result;
    });
