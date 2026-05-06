import { createFileRoute } from "@tanstack/react-router";

import { publicApi } from "#/integrations/api";
import { getWorkerEnv } from "#/integrations/appenv/worker";

export const Route = createFileRoute("/api/public/$")({
    server: {
        handlers: {
            ANY: ({ request }) => publicApi.fetch(request, getWorkerEnv()),
        },
    },
});
