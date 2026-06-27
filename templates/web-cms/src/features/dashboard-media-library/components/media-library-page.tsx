import { TriangleAlertIcon, UploadIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { FieldError } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { NativeSelect, NativeSelectOption } from "#/components/ui/native-select";
import { MediaLibraryEmptyState } from "#/features/dashboard-media-library/components/organisms/media-library-empty-state";
import { MediaLibraryFilters } from "#/features/dashboard-media-library/components/organisms/media-library-filters";
import { MediaPagination } from "#/features/dashboard-media-library/components/organisms/media-pagination";
import { MediaTable } from "#/features/dashboard-media-library/components/organisms/media-table";
import { UploadProgressCard } from "#/features/dashboard-media-library/components/organisms/upload-progress-card";
import { MediaLibraryPageTemplate } from "#/features/dashboard-media-library/components/templates/media-library-page-template";
import { useMediaLibraryFilter } from "#/features/dashboard-media-library/hooks/use-media-library-filter";
import { useMediaUpload } from "#/features/dashboard-media-library/hooks/use-media-upload";
import type { getMediaLibraryPage } from "#/features/dashboard-media-library/server/functions";
import { getManagedFieldProps, submitForm } from "#/lib/forms";

interface MediaLibraryPageProps {
    data: Awaited<ReturnType<typeof getMediaLibraryPage>>;
}

export function MediaLibraryPage({ data }: MediaLibraryPageProps) {
    const { filterForm, reloadPage, tagOptions } = useMediaLibraryFilter(data);
    const { fileInputRef, handleFilesSelected, uploadForm, uploads } = useMediaUpload({
        reloadPage,
    });
    const hasPartialPreviewFailure = data.items.some((item) => item.previewError);

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
                    aria-label="Upload media files"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/quicktime"
                    className="sr-only"
                    multiple
                    onChange={(event) => {
                        handleFilesSelected([...(event.target.files ?? [])]);
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
