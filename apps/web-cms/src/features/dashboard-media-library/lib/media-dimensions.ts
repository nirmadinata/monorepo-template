import { createClientOnlyFn } from "@tanstack/react-start";

import {
    ALLOWED_IMAGE_MIME_TYPES,
    ALLOWED_VIDEO_MIME_TYPES,
} from "#/features/dashboard-media-library/lib/constants";

export interface MediaDimensions {
    height: number;
    width: number;
}

const IMAGE_MIME_TYPE_SET = new Set<string>(ALLOWED_IMAGE_MIME_TYPES);
const VIDEO_MIME_TYPE_SET = new Set<string>(ALLOWED_VIDEO_MIME_TYPES);

export const readMediaDimensions = createClientOnlyFn(async (file: File) => {
    if (IMAGE_MIME_TYPE_SET.has(file.type)) {
        return readImageDimensions(file);
    }

    if (VIDEO_MIME_TYPE_SET.has(file.type)) {
        return readVideoDimensions(file);
    }

    return null;
});

const readImageDimensions = createClientOnlyFn(async (file: File) => {
    const url = URL.createObjectURL(file);

    try {
        const image = new Image();

        // oxlint-disable-next-line promise/avoid-new
        const result = await new Promise<{
            height: number;
            width: number;
        } | null>((resolve) => {
            image.addEventListener(
                "load",
                () => {
                    resolve(toDimensions(image.naturalWidth, image.naturalHeight));
                },
                { once: true }
            );
            image.addEventListener(
                "error",
                () => {
                    resolve(null);
                },
                { once: true }
            );
            image.src = url;
        });

        return result;
    } finally {
        URL.revokeObjectURL(url);
    }
});

const readVideoDimensions = createClientOnlyFn(async (file: File) => {
    const url = URL.createObjectURL(file);

    try {
        const video = document.createElement("video");
        video.preload = "metadata";

        type VideoMetadata = {
            height: number;
            width: number;
        };

        // oxlint-disable-next-line promise/avoid-new
        const result = await new Promise<VideoMetadata | null>((resolve) => {
            video.addEventListener(
                "loadedmetadata",
                () => {
                    resolve(toDimensions(video.videoWidth, video.videoHeight));
                },
                { once: true }
            );
            video.addEventListener(
                "error",
                () => {
                    resolve(null);
                },
                { once: true }
            );
            video.src = url;
        });

        return result;
    } finally {
        URL.revokeObjectURL(url);
    }
});

const toDimensions = createClientOnlyFn((width: number, height: number) => {
    if (width > 0 && height > 0) {
        return { height, width } as MediaDimensions;
    }

    return null;
});
