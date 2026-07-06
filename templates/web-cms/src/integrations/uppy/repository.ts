import type { Meta, Body, UppyFile } from "@uppy/core";

import { getPresignedDownloadUrl } from "./clients";
import { extractUploadedFileMetadata } from "./util";
import type { UploadedFileEntry } from "./util";

export async function createUploadedFileEntry(
    file: UppyFile<Meta, Body>,
    key: string
): Promise<UploadedFileEntry> {
    const { url } = await getPresignedDownloadUrl({ data: { key } });
    return extractUploadedFileMetadata(file, key, url);
}
