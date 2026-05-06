import { createFileRoute } from "@tanstack/react-router";

import { publicApi } from "#/integrations/api";
import { getWorkerEnv } from "#/integrations/appenv/worker";

function handlePublicApi(request: Request) {
    return publicApi.fetch(request, getWorkerEnv());
}

export const Route = createFileRoute("/api/public/$")({
    server: {
        handlers: {
            ANY: ({ request }) => handlePublicApi(request),
        },
    },
});
