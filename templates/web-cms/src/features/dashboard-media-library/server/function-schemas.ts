import * as v from "valibot";

export const uploadIntentInputSchema = v.object({
    fileName: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(255)),
    fileSize: v.pipe(
        v.number(),
        v.integer(),
        v.check((input) => input > 0, "")
    ),
    mimeType: v.pipe(v.string(), v.trim(), v.nonEmpty()),
});

export const finalizeUploadInputSchema = v.object({
    description: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(500)), ""),
    durationSeconds: v.optional(v.nullable(v.pipe(v.number(), v.integer(), v.minValue(0)))),
    height: v.optional(v.nullable(v.pipe(v.number(), v.integer(), v.minValue(0)))),
    imageAltText: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(255)), ""),
    mimeType: v.pipe(v.string(), v.trim(), v.nonEmpty()),
    name: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(255)), ""),
    originalFilename: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(255)),
    sizeInBytes: v.pipe(v.number(), v.integer(), v.minValue(1)),
    storageKey: v.pipe(v.string(), v.trim(), v.nonEmpty()),
    tagNames: v.optional(v.array(v.pipe(v.string(), v.trim())), []),
    width: v.optional(v.nullable(v.pipe(v.number(), v.integer(), v.minValue(0)))),
});

export const updateMediaTagsInputSchema = v.object({
    mediaId: v.pipe(v.number(), v.integer(), v.minValue(1)),
    tagNames: v.optional(v.array(v.pipe(v.string(), v.trim())), []),
});

export const deleteMediaInputSchema = v.object({
    mediaId: v.pipe(v.number(), v.integer(), v.minValue(1)),
});
