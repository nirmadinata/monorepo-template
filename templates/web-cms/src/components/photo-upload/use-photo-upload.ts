"use client";

import AwsS3 from "@uppy/aws-s3";
import type { Meta, Body, UppyFile } from "@uppy/core";
import { Uppy } from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import ImageEditor from "@uppy/image-editor";
import { useEffect, useRef, useState } from "react";

import { getPresignedUploadUrl } from "#/integrations/uppy/clients";
import { UPPY_MAX_FILE_SIZE, UPPY_UPLOAD_FOLDER } from "#/integrations/uppy/constants";
import { createUploadedFileEntry } from "#/integrations/uppy/repository";
import type { UploadedFileEntry } from "#/integrations/uppy/util";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import "@uppy/image-editor/css/style.min.css";

const IMAGE_TYPES = ["image/*"];

export interface UsePhotoUploadOptions {
    onUpload?: (entry: UploadedFileEntry) => void;
    maxFileSize?: number;
}

export interface UsePhotoUploadReturn {
    uploaded: UploadedFileEntry | null;
    isUploading: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function usePhotoUpload({
    onUpload,
    maxFileSize = UPPY_MAX_FILE_SIZE,
}: UsePhotoUploadOptions = {}): UsePhotoUploadReturn {
    const containerRef = useRef<HTMLDivElement>(null);
    const [uploaded, setUploaded] = useState<UploadedFileEntry | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const onUploadRef = useRef(onUpload);

    useEffect(() => {
        onUploadRef.current = onUpload;
    }, [onUpload]);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) {
            return;
        }

        const uppy = new Uppy({
            autoProceed: false,
            restrictions: {
                maxFileSize,
                maxNumberOfFiles: 1,
                allowedFileTypes: IMAGE_TYPES,
            },
        });

        uppy.use(AwsS3, {
            shouldUseMultipart: false,
            getUploadParameters: async (file: UppyFile<Meta, Body>) => {
                const key = `${UPPY_UPLOAD_FOLDER}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${file.name}`;
                uppy.setFileMeta(file.id, { key });
                const { url } = await getPresignedUploadUrl({
                    data: { key, contentType: file.type ?? "application/octet-stream" },
                });
                return {
                    method: "PUT",
                    url,
                    headers: { "content-type": file.type ?? "application/octet-stream" },
                };
            },
        });

        uppy.use(ImageEditor, {});

        uppy.use(Dashboard, {
            trigger: node,
            proudlyDisplayPoweredByUppy: false,
            hideProgressDetails: true,
        });

        uppy.on("upload", () => {
            setIsUploading(true);
        });

        uppy.on("upload-success", async (file) => {
            if (!file) {
                return;
            }
            const key = file.meta.key as string | undefined;
            if (!key) {
                return;
            }
            const entry = await createUploadedFileEntry(file, key);
            setUploaded(entry);
            setIsUploading(false);
            onUploadRef.current?.(entry);
        });

        uppy.on("upload-error", () => {
            setIsUploading(false);
        });

        return () => {
            uppy.destroy();
        };
    }, [maxFileSize]);

    return { uploaded, isUploading, containerRef };
}
