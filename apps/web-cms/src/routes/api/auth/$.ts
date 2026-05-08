import { createFileRoute } from "@tanstack/react-router";

import { getWorkerEnv } from "#/integrations/appenv/worker";
import { getAuth, getAuthSecondaryStorage } from "#/integrations/auth";

export const Route = createFileRoute("/api/auth/$")({
    server: {
        handlers: {
            ANY: async ({ request }) => {
                const env = await getWorkerEnv();
                const db = env.MAIN_DB;
                const secondaryStorage = getAuthSecondaryStorage(env.MAIN_KV);

                return getAuth({ db, secondaryStorage }).handler(request);
            },
        },
    },
});
