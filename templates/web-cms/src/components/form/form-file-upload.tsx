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
    UPPY_MAX_FILES,
    UPPY_ALLOWED_FILE_TYPES,
    UPPY_UPLOAD_FOLDER,
} from "#/integrations/uppy/constants";
import { createUploadedFileEntry } from "#/integrations/uppy/repository";
import type { UploadedFileEntry } from "#/integrations/uppy/util";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";

export interface FormFileUploadProps {
    field: AnyFieldApi;
    label: ReactNode;
    maxFiles?: number;
    maxFileSize?: number;
    allowedFileTypes?: string[];
    className?: string;
}

export function FormFileUpload({
    field,
    label,
    maxFiles = UPPY_MAX_FILES,
    maxFileSize = UPPY_MAX_FILE_SIZE,
    allowedFileTypes = UPPY_ALLOWED_FILE_TYPES,
    className,
}: FormFileUploadProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const uppyRef = useRef<Uppy | null>(null);
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);
    const existingEntries = (field.state.value as UploadedFileEntry[] | undefined) ?? [];

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const uppy = new Uppy({
            autoProceed: false,
            restrictions: {
                maxFileSize,
                maxNumberOfFiles: maxFiles,
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
            const current = (field.state.value as UploadedFileEntry[] | undefined) ?? [];
            field.handleChange([...current, entry]);
        });

        uppy.on("file-removed", (file) => {
            if (!file) {
                return;
            }
            const removedKey = file.meta.key as string | undefined;
            if (!removedKey) {
                return;
            }
            const current = (field.state.value as UploadedFileEntry[] | undefined) ?? [];
            field.handleChange(current.filter((entry) => entry.key !== removedKey));
        });

        uppyRef.current = uppy;

        return () => {
            uppy.destroy();
            uppyRef.current = null;
        };
    }, [maxFiles, maxFileSize, allowedFileTypes, field]);

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
                {existingEntries.length > 0 && (
                    <ul className="mt-2 space-y-1">
                        {existingEntries.map((entry) => (
                            <li key={entry.key} className="text-sm text-muted-foreground">
                                {entry.name} ({entry.key})
                            </li>
                        ))}
                    </ul>
                )}
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
