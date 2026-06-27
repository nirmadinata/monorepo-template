import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { UploadProgressItem } from "#/features/dashboard-media-library/components/types";
import {
    MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES,
    MEDIA_UPLOAD_SUBMISSION_SCHEMA,
} from "#/features/dashboard-media-library/lib/form-schema";
import { uploadMediaFile } from "#/features/dashboard-media-library/lib/upload-media";
import { createMediaUploadProgressUpdater } from "#/features/dashboard-media-library/lib/upload-progress";
import { runFormSubmission } from "#/lib/forms";

interface UseMediaUploadProps {
    reloadPage: () => Promise<void>;
}

const UPLOAD_CLEAR_DELAY_MS = 1000;

export function useMediaUpload({ reloadPage }: UseMediaUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const clearUploadsTimeoutRef = useRef<number | null>(null);
    const [uploads, setUploads] = useState<UploadProgressItem[]>([]);
    const progress = useMemo(() => createMediaUploadProgressUpdater(setUploads), []);

    useEffect(
        () => () => {
            if (clearUploadsTimeoutRef.current !== null) {
                window.clearTimeout(clearUploadsTimeoutRef.current);
            }
        },
        []
    );

    const uploadForm = useForm({
        validators: {
            onSubmit: MEDIA_UPLOAD_SUBMISSION_SCHEMA,
        },
        defaultValues: MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES,
        async onSubmit({ value, formApi }) {
            try {
                progress.start(value.files);

                // oxlint-disable no-await-in-loop
                for (const [index, file] of value.files.entries()) {
                    await uploadMediaFile(file, index, progress);
                }
                // oxlint-enable no-await-in-loop

                toast.success(
                    value.files.length === 1 ? "Media uploaded." : "Media uploads completed."
                );

                formApi.reset({ files: [] });

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                await reloadPage();
            } finally {
                clearUploadsTimeoutRef.current = window.setTimeout(() => {
                    progress.clear();
                }, UPLOAD_CLEAR_DELAY_MS);
            }
        },
    });

    function handleFilesSelected(files: File[]) {
        uploadForm.setFieldValue("files", files);

        if (files.length === 0) {
            return;
        }

        void runFormSubmission(uploadForm, "Unable to upload media right now.");
    }

    return {
        fileInputRef,
        handleFilesSelected,
        uploadForm,
        uploads,
    };
}
