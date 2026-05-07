import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import type { getAuth } from "#/integrations/auth";

type GetSession = ReturnType<typeof getAuth>["api"]["getSession"];

interface SessionReaderDeps {
    env: {
        MAIN_DB: D1Database;
        MAIN_KV: {
            delete: (key: string) => Promise<void>;
            get: (key: string) => Promise<string | null>;
            put: (
                key: string,
                value: string,
                options?: { expirationTtl: number }
            ) => Promise<void>;
        };
    };
    getSession: (context: { headers: Headers }) => ReturnType<GetSession>;
}

export function readCurrentSession(
    headers: Headers,
    { getSession }: SessionReaderDeps
) {
    return getSession({ headers });
}

export const getCurrentSession = createServerFn({ method: "GET" }).handler(
    async () => {
        const [{ getWorkerEnv }, { getAuth }] = await Promise.all([
            import("#/integrations/appenv/worker"),
            import("#/integrations/auth"),
        ]);

        const env = getWorkerEnv();
        const auth = getAuth({
            db: env.MAIN_DB,
            secondaryStorage: {
                delete: (key: string) => env.MAIN_KV.delete(key),
                get: (key: string) => env.MAIN_KV.get(key),
                set: (key: string, value: string, ttl?: number) =>
                    env.MAIN_KV.put(
                        key,
                        value,
                        ttl ? { expirationTtl: ttl } : undefined
                    ),
            },
        });

        return readCurrentSession(getRequestHeaders(), {
            env,
            getSession: auth.api.getSession,
        });
    }
);
