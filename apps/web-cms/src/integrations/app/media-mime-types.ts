export const IMAGE_MIME_TYPE = {
    GIF: "image/gif",
    JPEG: "image/jpeg",
    PNG: "image/png",
    SVG: "image/svg+xml",
    WEBP: "image/webp",
} as const;

export const VIDEO_MIME_TYPE = {
    MP4: "video/mp4",
    QUICKTIME: "video/quicktime",
    WEBM: "video/webm",
} as const;

export const IMAGE_MIME_TYPES = [
    IMAGE_MIME_TYPE.JPEG,
    IMAGE_MIME_TYPE.PNG,
    IMAGE_MIME_TYPE.GIF,
    IMAGE_MIME_TYPE.WEBP,
    IMAGE_MIME_TYPE.SVG,
] as const;

export const VIDEO_MIME_TYPES = [
    VIDEO_MIME_TYPE.MP4,
    VIDEO_MIME_TYPE.WEBM,
    VIDEO_MIME_TYPE.QUICKTIME,
] as const;

export const MEDIA_MIME_TYPES = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES] as const;

export const PDF_MIME_TYPE = "application/pdf" as const;

export const MEDIA_KIND = {
    IMAGE: "image",
    VIDEO: "video",
} as const;

export type MediaKind = (typeof MEDIA_KIND)[keyof typeof MEDIA_KIND];

export const MEDIA_KIND_VALUES = [MEDIA_KIND.IMAGE, MEDIA_KIND.VIDEO] as const;

export const SEEDED_MEDIA_MIME_TYPES = [
    {
        kind: MEDIA_KIND.IMAGE,
        mimeType: IMAGE_MIME_TYPE.JPEG,
        title: "JPEG image",
    },
    {
        kind: MEDIA_KIND.IMAGE,
        mimeType: IMAGE_MIME_TYPE.PNG,
        title: "PNG image",
    },
    {
        kind: MEDIA_KIND.IMAGE,
        mimeType: IMAGE_MIME_TYPE.GIF,
        title: "GIF image",
    },
    {
        kind: MEDIA_KIND.IMAGE,
        mimeType: IMAGE_MIME_TYPE.WEBP,
        title: "WebP image",
    },
    {
        kind: MEDIA_KIND.IMAGE,
        mimeType: IMAGE_MIME_TYPE.SVG,
        title: "SVG image",
    },
    {
        kind: MEDIA_KIND.VIDEO,
        mimeType: VIDEO_MIME_TYPE.MP4,
        title: "MP4 video",
    },
    {
        kind: MEDIA_KIND.VIDEO,
        mimeType: VIDEO_MIME_TYPE.WEBM,
        title: "WebM video",
    },
    {
        kind: MEDIA_KIND.VIDEO,
        mimeType: VIDEO_MIME_TYPE.QUICKTIME,
        title: "QuickTime video",
    },
] as const satisfies readonly {
    kind: MediaKind;
    mimeType: (typeof MEDIA_MIME_TYPES)[number];
    title: string;
}[];

export const SEEDED_MEDIA_MIME_TYPE_SET = new Set<string>(
    SEEDED_MEDIA_MIME_TYPES.map((mime) => mime.mimeType)
);

export const SEEDED_MEDIA_KIND_BY_MIME_TYPE = new Map<string, MediaKind>(
    SEEDED_MEDIA_MIME_TYPES.map((mime) => [mime.mimeType, mime.kind])
);

export type SeededMediaMimeType = (typeof SEEDED_MEDIA_MIME_TYPES)[number]["mimeType"];
export type SeededMediaKind = (typeof SEEDED_MEDIA_MIME_TYPES)[number]["kind"];
