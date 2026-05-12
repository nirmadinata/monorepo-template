import { z } from "zod";

import {
    MEDIA_LIBRARY_FILTER_KIND_VALUES,
    MEDIA_LIBRARY_PAGE_SIZE,
    normalizeTagNames,
} from "./media-library";

export const mediaLibrarySearchSchema = z.object({
    kind: z.enum(MEDIA_LIBRARY_FILTER_KIND_VALUES).optional().default("all"),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).optional().default(MEDIA_LIBRARY_PAGE_SIZE),
    search: z.string().trim().max(100).optional().default(""),
    tag: z.string().trim().max(100).optional().default(""),
});

export const mediaLibrarySearchFormSchema = z.object({
    kind: z.enum(MEDIA_LIBRARY_FILTER_KIND_VALUES),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(50),
    search: z.string().trim().max(100),
    tag: z.string().trim().max(100),
});

export const mediaTagEditSchema = z.object({
    mediaId: z.number().int().positive(),
    tagDraft: z.string().default(""),
});

export const mediaTagEditFormSchema = z.object({
    mediaId: z.number().int().positive(),
    tagDraft: z.string(),
});

export const mediaUploadSubmissionSchema = z.object({
    files: z.array(z.file()).min(1, "Select at least one file to upload."),
});

export const MEDIA_UPLOAD_SUBMISSION_FORM_DEFAULT_VALUES: z.infer<
    typeof mediaUploadSubmissionSchema
> = {
    files: [],
};

export type MediaLibrarySearchValues = z.infer<typeof mediaLibrarySearchSchema>;
export type MediaTagEditValues = z.infer<typeof mediaTagEditSchema>;
export type MediaUploadSubmissionValues = z.infer<typeof mediaUploadSubmissionSchema>;

export function parseTagDraft(tagDraft: string) {
    return normalizeTagNames(tagDraft.split(/[\n,]+/));
}
