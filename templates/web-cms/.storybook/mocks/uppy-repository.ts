export function createUploadedFileEntry(
    file: { name?: string; size?: number; type?: string },
    key: string
) {
    return Promise.resolve({
        key,
        name: file.name ?? "unknown",
        size: file.size ?? 0,
        type: file.type ?? "application/octet-stream",
        url: "https://example.com/presigned-get-url",
    });
}
