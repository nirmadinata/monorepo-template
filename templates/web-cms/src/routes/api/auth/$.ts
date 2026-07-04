import { createFileRoute } from "@tanstack/react-router";

import { getAuth } from "#/integrations/auth/clients";
import { getAuthSecondaryStorage } from "#/integrations/auth/repository";
import { getWorkerEnv } from "#/integrations/workers/clients";

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
