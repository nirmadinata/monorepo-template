import { readMediaDimensions } from "#/features/dashboard-media-library/lib/media-dimensions";
import {
    finalizeMediaUpload,
    requestMediaUploadIntent,
} from "#/features/dashboard-media-library/server/functions";

import type { MediaUploadProgressUpdater } from "./upload-progress";

export async function uploadMediaFile(
    file: File,
    index: number,
    onProgress: MediaUploadProgressUpdater
) {
    const [intent, dimensions] = await Promise.all([
        requestMediaUploadIntent({
            data: {
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
            },
        }),
        readMediaDimensions(file).catch(() => null),
    ]);

    onProgress.setProgress(index, 10);

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

    onProgress.setProgress(index, 80);

    await finalizeMediaUpload({
        data: {
            description: "",
            durationSeconds: null,
            height: dimensions?.height ?? null,
            imageAltText: "",
            mimeType: file.type,
            name: "",
            originalFilename: file.name,
            sizeInBytes: file.size,
            storageKey: intent.storageKey,
            tagNames: [],
            width: dimensions?.width ?? null,
        },
    });

    onProgress.markDone(index);
}
