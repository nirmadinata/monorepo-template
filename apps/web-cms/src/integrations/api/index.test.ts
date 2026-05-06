// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";

describe("publicApi", () => {
    beforeEach(() => {
        process.env.BETTER_AUTH_SECRET = "change-me-change-me-change-me-1234";
        process.env.BETTER_AUTH_TRUSTED_ORIGINS = "http://localhost:3000";
        process.env.BETTER_AUTH_URL = "http://localhost:3000";
        process.env.GOOGLE_CLIENT_ID = "replace-me.apps.googleusercontent.com";
        process.env.GOOGLE_CLIENT_SECRET = "replace-me-google-client-secret";
        process.env.PUBLIC_API_DESCRIPTION =
            "Public API foundation for the web CMS";
        process.env.PUBLIC_API_TITLE = "Web CMS Public API";
        process.env.PUBLIC_API_VERSION = "0.1.0";
    });

    it("serves the health route and OpenAPI metadata", async () => {
        const { publicApi } = await import("./index");

        const healthResponse = await publicApi.request("/health");
        const openApiResponse = await publicApi.request("/openapi.json");

        expect(healthResponse.status).toBe(200);
        await expect(healthResponse.json()).resolves.toStrictEqual({
            ok: true,
            service: "web-cms-public-api",
        });

        expect(openApiResponse.status).toBe(200);
        await expect(openApiResponse.json()).resolves.toMatchObject({
            info: {
                title: "Web CMS Public API",
                version: "0.1.0",
            },
            openapi: "3.0.0",
            servers: [
                {
                    url: "http://localhost/api/public",
                },
            ],
        });
    });

    it("serves the Scalar API reference UI", async () => {
        const { publicApi } = await import("./index");

        const docsResponse = await publicApi.request("/docs");
        const docsHtml = await docsResponse.text();

        expect(docsResponse.status).toBe(200);
        expect(docsHtml).toContain("Web CMS Public API Docs");
        expect(docsHtml).toContain("/api/public/openapi.json");
    });
});
