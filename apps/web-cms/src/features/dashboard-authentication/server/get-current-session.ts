import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getWorkerEnv } from "#/integrations/appenv/worker";
import { getAuth, getAuthSecondaryStorage } from "#/integrations/auth";

export const getCurrentSession = createServerFn({ method: "GET" }).handler(
    async () => {
        const { MAIN_DB, MAIN_KV } = getWorkerEnv();
        const secondaryStorage = getAuthSecondaryStorage(MAIN_KV);
        const headers = getRequestHeaders();
        const auth = getAuth({ db: MAIN_DB, secondaryStorage });

        return auth.api.getSession({ headers });
    }
);
