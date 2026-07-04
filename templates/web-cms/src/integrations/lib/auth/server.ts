import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getAuth } from "#/integrations/clients/auth-server";
import { getAuthSecondaryStorage } from "#/integrations/lib/auth/adapter";
import { hasExistingUsers } from "#/integrations/lib/auth/bootstrap";
import { getWorkerEnv } from "#/integrations/workers/env";

export const getBootstrapState = createServerFn({ method: "GET" }).handler(async () => {
    const env = await getWorkerEnv();
    const hasUsers = await hasExistingUsers(env.MAIN_DB);

    return {
        hasUsers,
        isBootstrapOpen: !hasUsers,
    };
});

export const getCurrentSession = createServerFn({ method: "GET" }).handler(async () => {
    const env = await getWorkerEnv();
    const secondaryStorage = getAuthSecondaryStorage(env.MAIN_KV);
    const headers = getRequestHeaders();
    const auth = getAuth({ db: env.MAIN_DB, secondaryStorage });

    return auth.api.getSession({ headers });
});
