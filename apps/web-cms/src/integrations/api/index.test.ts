// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock(import("#/integrations/appenv"), () => ({
    appenv: {
        BUCKET_NAME: "test-bucket",
        PUBLIC_API_DESCRIPTION: "Public API foundation for the web CMS.",
        PUBLIC_API_TITLE: "Web CMS Public API",
        PUBLIC_API_VERSION: "0.1.0",
    },
}));

describe("public API", () => {
    it("serves the health endpoint", async () => {
        const { api } = await import("./index");

        const response = await api.fetch(new Request("https://example.com/api/public/health"));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toStrictEqual({
            ok: true,
            service: "web-cms-public-api",
        });
    });

    it("builds OpenAPI metadata from the configured app environment", async () => {
        const { api } = await import("./index");

        const response = await api.fetch(
            new Request("https://example.com/api/public/openapi.json")
        );

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({
            info: {
                description: "Public API foundation for the web CMS.",
                title: "Web CMS Public API",
                version: "0.1.0",
            },
            openapi: "3.0.0",
            servers: [
                {
                    description: "Current environment",
                    url: "https://example.com/api/public",
                },
            ],
        });
    });
});
