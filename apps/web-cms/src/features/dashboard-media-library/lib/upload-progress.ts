import type { Dispatch, SetStateAction } from "react";

import type { UploadProgressItem } from "#/features/dashboard-media-library/components/types";

export interface MediaUploadProgressUpdater {
    start: (files: readonly File[]) => void;
    setProgress: (index: number, progress: number) => void;
    markDone: (index: number) => void;
    clear: () => void;
}

export function createMediaUploadProgressUpdater(
    setUploads: Dispatch<SetStateAction<UploadProgressItem[]>>
): MediaUploadProgressUpdater {
    return {
        start(files) {
            setUploads(
                files.map((file) => ({
                    fileName: file.name,
                    id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
                    progress: 0,
                    status: "uploading",
                }))
            );
        },
        setProgress(index, progress) {
            setUploads((current) =>
                current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, progress } : item
                )
            );
        },
        markDone(index) {
            setUploads((current) =>
                current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, progress: 100, status: "done" } : item
                )
            );
        },
        clear() {
            setUploads([]);
        },
    };
}
