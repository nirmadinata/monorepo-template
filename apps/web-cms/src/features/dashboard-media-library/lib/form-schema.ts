import * as v from "valibot";

import {
    MEDIA_LIBRARY_FILTER_KIND_VALUES,
    MEDIA_LIBRARY_KIND_ENUM,
    MEDIA_LIBRARY_PAGE_SIZE,
    normalizeTagNames,
} from "./media-library";

export const mediaLibrarySearchSchema = v.object({
    kind: v.optional(
        v.fallback(
            v.picklist(MEDIA_LIBRARY_FILTER_KIND_VALUES, MEDIA_LIBRARY_KIND_ENUM.ALL),
            MEDIA_LIBRARY_KIND_ENUM.ALL
        )
    ),
    page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
    pageSize: v.optional(
        v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
        MEDIA_LIBRARY_PAGE_SIZE
    ),
    search: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(100)), ""),
    tag: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(100)), ""),
});

export const mediaLibrarySearchFormSchema = v.object({
    kind: v.optional(
        v.fallback(v.picklist(MEDIA_LIBRARY_FILTER_KIND_VALUES), MEDIA_LIBRARY_KIND_ENUM.ALL),
        MEDIA_LIBRARY_KIND_ENUM.ALL
    ),
    page: v.pipe(v.number(), v.integer(), v.minValue(1)),
    pageSize: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
    search: v.pipe(v.string(), v.trim(), v.maxLength(100)),
    tag: v.pipe(v.string(), v.trim(), v.maxLength(100)),
});

export const mediaTagEditSchema = v.object({
    mediaId: v.pipe(
        v.number(),
        v.integer(),
        v.check((val) => val > 0, "Media ID must be a positive integer.")
    ),
    tagDraft: v.optional(v.string(), ""),
});

export const mediaTagEditFormSchema = v.object({
    mediaId: v.pipe(
        v.number(),
        v.integer(),
        v.check((val) => val > 0, "Media ID must be a positive integer.")
    ),
    tagDraft: v.string(),
});

export const mediaUploadSubmissionSchema = v.object({
    files: v.pipe(v.array(v.file()), v.minLength(1, "Select at least one file to upload.")),
});

export const MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES: v.InferOutput<
    typeof mediaUploadSubmissionSchema
> = {
    files: [],
};

export type MediaLibrarySearchValues = v.InferOutput<typeof mediaLibrarySearchSchema>;
export type MediaTagEditValues = v.InferOutput<typeof mediaTagEditSchema>;
export type MediaUploadSubmissionValues = v.InferOutput<typeof mediaUploadSubmissionSchema>;

export function parseTagDraft(tagDraft: string) {
    return normalizeTagNames(tagDraft.split(/[\n,]+/));
}
