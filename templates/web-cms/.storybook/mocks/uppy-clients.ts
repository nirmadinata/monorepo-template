export const getPresignedUploadUrl = (_payload: { data: { key: string; contentType: string } }) =>
    Promise.resolve({ url: "https://example.com/presigned-put-url" });

export const getPresignedDownloadUrl = (_payload: { data: { key: string } }) =>
    Promise.resolve({ url: "https://example.com/presigned-get-url" });

export const createBaseUppy = () => {
    throw new Error("createBaseUppy is not available in Storybook");
};
