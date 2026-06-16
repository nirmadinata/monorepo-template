import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { toast } from "sonner";

import type { UploadProgressItem } from "#/features/dashboard-media-library/components/types";
import {
    MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES,
    MEDIA_UPLOAD_SUBMISSION_SCHEMA,
} from "#/features/dashboard-media-library/lib/form-schema";
import {
    finalizeMediaUpload,
    requestMediaUploadIntent,
} from "#/features/dashboard-media-library/server/functions";
import { runFormSubmission } from "#/lib/forms";

interface UseMediaUploadProps {
    reloadPage: () => Promise<void>;
}

export function useMediaUpload({ reloadPage }: UseMediaUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploads, setUploads] = useState<UploadProgressItem[]>([]);

    const uploadForm = useForm({
        validators: {
            onSubmit: MEDIA_UPLOAD_SUBMISSION_SCHEMA,
        },
        defaultValues: MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES,
        async onSubmit({ value, formApi }) {
            setUploads(
                value.files.map((file) => ({
                    fileName: file.name,
                    id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
                    progress: 0,
                    status: "uploading",
                }))
            );

            try {
                // oxlint-disable no-await-in-loop
                for (const [index, file] of value.files.entries()) {
                    const intent = await requestMediaUploadIntent({
                        data: {
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type,
                        },
                    });

                    setUploads((current) =>
                        current.map((item, idx) =>
                            idx === index ? { ...item, progress: 10 } : item
                        )
                    );

                    const uploadResponse = await fetch(intent.uploadUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": file.type,
                        },
                        body: file,
                    });

                    if (!uploadResponse.ok) {
                        throw new Error(`Upload failed for ${file.name}.`);
                    }

                    setUploads((current) =>
                        current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, progress: 80 } : item
                        )
                    );

                    await finalizeMediaUpload({
                        data: {
                            description: "",
                            durationSeconds: null,
                            height: null,
                            imageAltText: "",
                            mimeType: file.type,
                            name: "",
                            originalFilename: file.name,
                            sizeInBytes: file.size,
                            storageKey: intent.storageKey,
                            tagNames: [],
                            width: null,
                        },
                    });

                    setUploads((current) =>
                        current.map((item, itemIndex) =>
                            itemIndex === index
                                ? {
                                      ...item,
                                      progress: 100,
                                      status: "done",
                                  }
                                : item
                        )
                    );
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
                window.setTimeout(() => {
                    setUploads([]);
                }, 1000);
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
