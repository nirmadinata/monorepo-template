import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import type { getAuth } from "#/integrations/auth";

type GetSession = ReturnType<typeof getAuth>["api"]["getSession"];

type SessionGetter = (context: { headers: Headers }) => ReturnType<GetSession>;

export function readCurrentSession(
    headers: Headers,
    getSession: SessionGetter
) {
    return getSession({ headers });
}

export const getCurrentSession = createServerFn({ method: "GET" }).handler(
    async () => {
        const [{ getWorkerEnv }, { createAuthSecondaryStorage, getAuth }] =
            await Promise.all([
                import("#/integrations/appenv/worker"),
                import("#/integrations/auth"),
            ]);

        const { MAIN_DB, MAIN_KV } = getWorkerEnv();
        const auth = getAuth({
            db: MAIN_DB,
            secondaryStorage: createAuthSecondaryStorage(MAIN_KV),
        });

        return readCurrentSession(getRequestHeaders(), auth.api.getSession);
    }
);
