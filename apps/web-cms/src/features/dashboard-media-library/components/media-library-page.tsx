import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { TriangleAlertIcon, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { FieldError } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { NativeSelect, NativeSelectOption } from "#/components/ui/native-select";
import { getManagedFieldProps, runFormSubmission, submitForm } from "#/lib/forms";

import {
    MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES,
    mediaLibrarySearchFormSchema,
    mediaLibrarySearchSchema,
    mediaUploadSubmissionSchema,
} from "../lib/form-schema";
import type { getMediaLibraryPage } from "../server/media-library";
import { finalizeMediaUpload, requestMediaUploadIntent } from "../server/media-library";
import { MediaLibraryEmptyState } from "./organisms/media-library-empty-state";
import { MediaLibraryFilters } from "./organisms/media-library-filters";
import { MediaPagination } from "./organisms/media-pagination";
import { MediaTable } from "./organisms/media-table";
import { UploadProgressCard } from "./organisms/upload-progress-card";
import { MediaLibraryPageTemplate } from "./templates/media-library-page-template";
import type { UploadProgressItem } from "./types";

interface MediaLibraryPageProps {
    data: Awaited<ReturnType<typeof getMediaLibraryPage>>;
}

export function MediaLibraryPage({ data }: MediaLibraryPageProps) {
    const navigate = useNavigate({ from: "/dashboard/media" });
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploads, setUploads] = useState<UploadProgressItem[]>([]);
    const hasPartialPreviewFailure = data.items.some((item) => item.previewError);

    const filterForm = useForm({
        defaultValues: mediaLibrarySearchSchema.parse(data.filters),
        onSubmit: async ({ value }) => {
            await navigate({
                to: "/dashboard/media",
                search: (previous) => ({
                    ...previous,
                    kind: value.kind,
                    page: 1,
                    pageSize: value.pageSize,
                    search: value.search,
                    tag: value.tag,
                }),
                reloadDocument: true,
            });
        },
        validators: {
            onSubmit: mediaLibrarySearchFormSchema,
        },
    });

    const uploadForm = useForm({
        validators: {
            onSubmit: mediaUploadSubmissionSchema,
        },
        defaultValues: MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES,
        onSubmit: async ({ value, formApi }) => {
            setUploads(
                value.files.map((file) => ({
                    fileName: file.name,
                    id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
                    progress: 0,
                    status: "uploading",
                }))
            );

            try {
                for (const [index, file] of value.files.entries()) {
                    const intent = await requestMediaUploadIntent({
                        data: {
                            fileName: file.name,
                            fileSize: file.size,
                            mimeType: file.type,
                        },
                    });

                    setUploads((current) =>
                        current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, progress: 10 } : item
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

    const tagOptions = useMemo(
        () => [
            { label: "All tags", value: "" },
            ...data.availableTags.map((tag: (typeof data.availableTags)[number]) => ({
                label: tag.name,
                value: tag.slug,
            })),
        ],
        [data.availableTags]
    );

    useEffect(() => {
        filterForm.reset(mediaLibrarySearchSchema.parse(data.filters));
    }, [data.filters, filterForm]);

    async function reloadPage() {
        await navigate({
            to: "/dashboard/media",
            search: (previous) => previous,
            replace: true,
        });
    }

    function renderUploadAction() {
        return (
            <uploadForm.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                    <Button
                        disabled={isSubmitting}
                        onClick={() => {
                            fileInputRef.current?.click();
                        }}
                        type="button"
                    >
                        <UploadIcon />
                        {isSubmitting ? "Uploading..." : "Upload files"}
                    </Button>
                )}
            </uploadForm.Subscribe>
        );
    }

    return (
        <MediaLibraryPageTemplate
            content={
                data.items.length === 0 ? (
                    <MediaLibraryEmptyState uploadAction={renderUploadAction()} />
                ) : (
                    <>
                        <MediaTable items={data.items} onDeleted={reloadPage} />
                        <MediaPagination
                            currentPage={data.pagination.page}
                            filters={data.filters}
                            totalPages={data.pagination.totalPages}
                        />
                    </>
                )
            }
            fileInput={
                <input
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/quicktime"
                    className="sr-only"
                    multiple
                    onChange={(event) => {
                        const files = [...(event.target.files ?? [])];

                        uploadForm.setFieldValue("files", files);

                        if (files.length === 0) {
                            return;
                        }

                        void runFormSubmission(uploadForm, "Unable to upload media right now.");
                    }}
                    type="file"
                />
            }
            filters={
                <MediaLibraryFilters
                    actions={
                        <filterForm.Subscribe
                            selector={(state) => ({
                                errors: state.errors,
                                isSubmitting: state.isSubmitting,
                            })}
                        >
                            {({ errors, isSubmitting }) => (
                                <div className="flex flex-col gap-2 sm:items-end">
                                    <Button disabled={isSubmitting} type="submit" variant="outline">
                                        Apply filters
                                    </Button>
                                    <FieldError errors={errors} />
                                </div>
                            )}
                        </filterForm.Subscribe>
                    }
                    kindField={
                        <filterForm.Field name="kind">
                            {(field) => (
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-foreground">
                                        Type
                                    </span>
                                    <NativeSelect
                                        {...getManagedFieldProps(field)}
                                        onChange={(event) => {
                                            field.handleChange(
                                                event.currentTarget
                                                    .value as typeof data.filters.kind
                                            );
                                        }}
                                    >
                                        {data.availableKinds.map((kind) => (
                                            <NativeSelectOption key={kind} value={kind}>
                                                {kind === "all"
                                                    ? "All media"
                                                    : `${kind[0]?.toUpperCase()}${kind.slice(1)}s`}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                </div>
                            )}
                        </filterForm.Field>
                    }
                    onSubmit={(event) => {
                        void submitForm(event, filterForm, "Unable to apply media filters.");
                    }}
                    searchField={
                        <filterForm.Field name="search">
                            {(field) => {
                                const fieldProps = getManagedFieldProps(field);

                                return (
                                    <div className="flex flex-1 flex-col gap-2">
                                        <label
                                            className="text-sm font-medium text-foreground"
                                            htmlFor="media-search"
                                        >
                                            Search by name
                                        </label>
                                        <Input
                                            {...fieldProps}
                                            id="media-search"
                                            onChange={(event) => {
                                                field.handleChange(event.currentTarget.value);
                                            }}
                                            placeholder="Search by media name"
                                        />
                                    </div>
                                );
                            }}
                        </filterForm.Field>
                    }
                    tagField={
                        <filterForm.Field name="tag">
                            {(field) => (
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-foreground">Tag</span>
                                    <NativeSelect
                                        {...getManagedFieldProps(field)}
                                        onChange={(event) => {
                                            field.handleChange(event.currentTarget.value);
                                        }}
                                    >
                                        {tagOptions.map((tag) => (
                                            <NativeSelectOption
                                                key={tag.value || "all"}
                                                value={tag.value}
                                            >
                                                {tag.label}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                </div>
                            )}
                        </filterForm.Field>
                    }
                />
            }
            headerUploadAction={renderUploadAction()}
            previewFailureAlert={
                hasPartialPreviewFailure ? (
                    <Alert>
                        <TriangleAlertIcon />
                        <AlertTitle>Some previews could not be loaded.</AlertTitle>
                        <AlertDescription>
                            Media metadata remains visible so you can still review or delete the
                            affected assets.
                        </AlertDescription>
                    </Alert>
                ) : null
            }
            totalItems={data.pagination.totalItems}
            uploadErrors={
                <uploadForm.Subscribe selector={(state) => state.errors}>
                    {(errors) => <FieldError errors={errors} />}
                </uploadForm.Subscribe>
            }
            uploadProgress={<UploadProgressCard uploads={uploads} />}
        />
    );
}
