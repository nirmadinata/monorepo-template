"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import AwsS3 from "@uppy/aws-s3";
import { Uppy } from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { getPresignedUploadUrl } from "#/integrations/uppy/clients";
import {
    UPPY_MAX_FILE_SIZE,
    UPPY_ALLOWED_FILE_TYPES,
    UPPY_UPLOAD_FOLDER,
} from "#/integrations/uppy/constants";
import { createUploadedFileEntry } from "#/integrations/uppy/repository";
import type { UploadedFileEntry } from "#/integrations/uppy/util";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";

export interface FormFileUploadSingleProps {
    field: AnyFieldApi;
    label: ReactNode;
    maxFileSize?: number;
    allowedFileTypes?: string[];
    className?: string;
}

export function FormFileUploadSingle({
    field,
    label,
    maxFileSize = UPPY_MAX_FILE_SIZE,
    allowedFileTypes = UPPY_ALLOWED_FILE_TYPES,
    className,
}: FormFileUploadSingleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const uppyRef = useRef<Uppy | null>(null);
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);
    const existingEntry = field.state.value as UploadedFileEntry | null | undefined;

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const uppy = new Uppy({
            autoProceed: false,
            restrictions: {
                maxFileSize,
                maxNumberOfFiles: 1,
                allowedFileTypes,
            },
        });

        uppy.use(AwsS3, {
            shouldUseMultipart: false,
            getUploadParameters: async (file) => {
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

        uppy.use(Dashboard, {
            inline: true,
            target: containerRef.current,
            proudlyDisplayPoweredByUppy: false,
            hideProgressDetails: true,
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
            field.handleChange(entry);
        });

        uppy.on("file-removed", () => {
            field.handleChange(null);
        });

        uppyRef.current = uppy;

        return () => {
            uppy.destroy();
            uppyRef.current = null;
        };
    }, [maxFileSize, allowedFileTypes, field]);

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <div
                    ref={containerRef}
                    id={String(field.name)}
                    aria-describedby={
                        fieldErrors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined
                    }
                    aria-invalid={fieldErrors.length > 0 || undefined}
                />
                {existingEntry && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        {existingEntry.name} ({existingEntry.key})
                    </div>
                )}
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
