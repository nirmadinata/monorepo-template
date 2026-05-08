import { createFileRoute } from "@tanstack/react-router";

import { api } from "#/integrations/api";
import { getWorkerEnv } from "#/integrations/appenv/worker";

export const Route = createFileRoute("/api/public/$")({
    server: {
        handlers: {
            ANY: ({ request }) => api.fetch(request, getWorkerEnv()),
        },
    },
});
