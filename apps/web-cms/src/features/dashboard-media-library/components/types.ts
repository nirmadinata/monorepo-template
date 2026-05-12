import type { getMediaLibraryPage } from "../server/media-library";

export type MediaLibraryPageData = Awaited<ReturnType<typeof getMediaLibraryPage>>;

export type MediaLibraryItem = MediaLibraryPageData["items"][number];

export interface UploadProgressItem {
    fileName: string;
    id: string;
    progress: number;
    status: "done" | "uploading";
}
