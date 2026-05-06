import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import { appenv } from "#/integrations/appenv";
import type { AppWorkerEnv } from "#/integrations/appenv/worker";

import { publicApiRoutes } from "./routes/system";

interface PublicApiEnv {
    Bindings: AppWorkerEnv;
}

export const publicApi = new OpenAPIHono<PublicApiEnv>({
    defaultHook: (result, c) => {
        if (!result.success) {
            return c.json(
                {
                    error: "VALIDATION_ERROR",
                    issues: result.error.issues,
                    ok: false,
                },
                422
            );
        }
    },
});

publicApi.openapiRoutes(publicApiRoutes);

publicApi.doc("/openapi.json", (c) => ({
    openapi: "3.0.0",
    info: {
        description:
            appenv.PUBLIC_API_DESCRIPTION ??
            "Public API foundation for the web CMS.",
        title: appenv.PUBLIC_API_TITLE ?? "Web CMS Public API",
        version: appenv.PUBLIC_API_VERSION ?? "0.1.0",
    },
    servers: [
        {
            description: "Current environment",
            url: `${new URL(c.req.url).origin}/api/public`,
        },
    ],
}));

publicApi.get(
    "/docs",
    Scalar((c) => ({
        pageTitle: `${appenv.PUBLIC_API_TITLE ?? "Web CMS Public API"} Docs`,
        theme: "saturn",
        url: `${new URL(c.req.url).origin}/api/public/openapi.json`,
    }))
);
