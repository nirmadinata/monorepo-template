import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

import { getAuth } from "#/integrations/auth";

const kv = env.MAIN_KV;
const db = env.MAIN_DB;
const secondaryStorage = {
    get: (key: string) => kv.get(key),
    delete: (key: string) => kv.delete(key),
    set: (key: string, value: string, ttl?: number) =>
        kv.put(key, value, ttl ? { expirationTtl: ttl } : undefined),
};

export const Route = createFileRoute("/api/auth/$")({
    server: {
        handlers: {
            ANY: ({ request }) =>
                getAuth({ db, secondaryStorage }).handler(request),
        },
    },
});
