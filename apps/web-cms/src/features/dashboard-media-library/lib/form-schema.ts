import * as v from "valibot";

import {
    MEDIA_LIBRARY_FILTER_KIND_VALUES,
    MEDIA_LIBRARY_KIND_ENUM,
    MEDIA_LIBRARY_PAGE_SIZE,
} from "#/features/dashboard-media-library/lib/constants";

export const MEDIA_LIBRARY_SEARCH_SCHEMA = v.object({
    kind: v.optional(v.picklist(MEDIA_LIBRARY_FILTER_KIND_VALUES), MEDIA_LIBRARY_KIND_ENUM.ALL),
    page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
    pageSize: v.optional(
        v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
        MEDIA_LIBRARY_PAGE_SIZE
    ),
    search: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(100)), ""),
    tag: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(100)), ""),
});

export const MEDIA_TAG_EDIT_SCHEMA = v.object({
    mediaId: v.pipe(
        v.number(),
        v.integer(),
        v.check((val) => val > 0, "Media ID must be a positive integer.")
    ),
    tagDraft: v.optional(v.string(), ""),
});

export const MEDIA_TAG_EDIT_FORM_SCHEMA = v.object({
    mediaId: v.pipe(
        v.number(),
        v.integer(),
        v.check((val) => val > 0, "Media ID must be a positive integer.")
    ),
    tagDraft: v.string(),
});

export const MEDIA_UPLOAD_SUBMISSION_SCHEMA = v.object({
    files: v.pipe(v.array(v.file()), v.minLength(1, "Select at least one file to upload.")),
});

export const MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES: v.InferOutput<
    typeof MEDIA_UPLOAD_SUBMISSION_SCHEMA
> = {
    files: [],
};

export type MediaLibrarySearchValues = v.InferOutput<typeof MEDIA_LIBRARY_SEARCH_SCHEMA>;
export type MediaTagEditValues = v.InferOutput<typeof MEDIA_TAG_EDIT_SCHEMA>;
export type MediaUploadSubmissionValues = v.InferOutput<typeof MEDIA_UPLOAD_SUBMISSION_SCHEMA>;
export type MediaTagEditFormValues = v.InferOutput<typeof MEDIA_TAG_EDIT_FORM_SCHEMA>;
export type MediaUploadSubmissionFormValues = v.InferOutput<typeof MEDIA_UPLOAD_SUBMISSION_SCHEMA>;
