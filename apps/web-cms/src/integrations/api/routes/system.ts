import { createRoute, defineOpenAPIRoute, z } from "@hono/zod-openapi";

const HealthResponseSchema = z
    .object({
        ok: z.literal(true),
        service: z.literal("web-cms-public-api"),
    })
    .openapi("PublicApiHealthResponse");

const getHealthRoute = defineOpenAPIRoute({
    route: createRoute({
        tags: ["System"],
        method: "get",
        path: "/health",
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: HealthResponseSchema,
                    },
                },
                description: "Public API health status.",
            },
        },
        summary: "Get public API health",
    }),
    handler: (c) =>
        c.json(
            {
                ok: true as const,
                service: "web-cms-public-api" as const,
            },
            200
        ),
});

export const publicApiRoutes = [getHealthRoute] as const;
