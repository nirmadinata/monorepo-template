import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

import { createAuthSecondaryStorage, getAuth } from "#/integrations/auth";

const db = env.MAIN_DB;
const secondaryStorage = createAuthSecondaryStorage(env.MAIN_KV);

export const Route = createFileRoute("/api/auth/$")({
    server: {
        handlers: {
            ANY: ({ request }) =>
                getAuth({ db, secondaryStorage }).handler(request),
        },
    },
});
