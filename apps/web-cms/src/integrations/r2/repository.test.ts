// @vitest-environment node

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createObjectBody, createS3ClientMock } from "#/test/factories";

const mocks = vi.hoisted(() => ({
    getSignedUrlSpy:
        vi.fn<
            (client: unknown, command: unknown, options: { expiresIn: number }) => Promise<string>
        >(),
}));

vi.mock(import("#/integrations/r2/constants"), () => ({
    DEFAULT_BUCKET_NAME: "test-bucket",
    PRESIGNED_URL_EXPIRATION: 900,
}));

vi.mock(import("@aws-sdk/s3-request-presigner/dist-types/getSignedUrl"), () => ({
    getSignedUrl: mocks.getSignedUrlSpy,
}));

describe("storageRepository", () => {
    beforeEach(() => {
        mocks.getSignedUrlSpy.mockReset();
    });

    it("generates upload URLs with the default bucket and expiry", async () => {
        const client = createS3ClientMock();
        mocks.getSignedUrlSpy.mockResolvedValue("https://example.com/upload");

        const { storageRepository } = await import("./repository");

        await expect(
            storageRepository.generatePresignedUploadUrl(client, {
                contentType: "text/html",
                key: "pages/home.html",
            })
        ).resolves.toStrictEqual({
            url: "https://example.com/upload",
        });

        const [, command, options] = mocks.getSignedUrlSpy.mock.calls[0] ?? [];
        expect(command).toBeInstanceOf(PutObjectCommand);
        expect((command as PutObjectCommand).input).toStrictEqual({
            Bucket: "test-bucket",
            ContentType: "text/html",
            Key: "pages/home.html",
        });
        expect(options).toStrictEqual({ expiresIn: 900 });
    });

    it("decodes text content returned from R2", async () => {
        const client = createS3ClientMock();
        client.send = vi.fn().mockResolvedValue({
            Body: createObjectBody("<h1>Hello</h1>"),
        });

        const { storageRepository } = await import("./repository");

        await expect(
            storageRepository.getTextContent(client, {
                key: "pages/home.html",
            })
        ).resolves.toBe("<h1>Hello</h1>");

        const [command] = vi.mocked(client.send).mock.calls[0] ?? [];
        expect(command).toBeInstanceOf(GetObjectCommand);
        expect((command as GetObjectCommand).input).toStrictEqual({
            Bucket: "test-bucket",
            Key: "pages/home.html",
        });
    });

    it("returns an empty string when the object body is missing", async () => {
        const client = createS3ClientMock();
        client.send = vi.fn().mockResolvedValue({ Body: undefined });

        const { storageRepository } = await import("./repository");

        await expect(
            storageRepository.getTextContent(client, {
                key: "pages/missing.html",
            })
        ).resolves.toBe("");
    });

    it("deletes objects from the requested bucket", async () => {
        const client = createS3ClientMock();
        client.send = vi.fn().mockResolvedValue({});

        const { storageRepository } = await import("./repository");

        await expect(
            storageRepository.deleteObject(client, {
                bucketName: "archive-bucket",
                key: "pages/old-home.html",
            })
        ).resolves.toBeUndefined();

        const [command] = vi.mocked(client.send).mock.calls[0] ?? [];
        expect(command).toBeInstanceOf(DeleteObjectCommand);
        expect((command as DeleteObjectCommand).input).toStrictEqual({
            Bucket: "archive-bucket",
            Key: "pages/old-home.html",
        });
    });
});
