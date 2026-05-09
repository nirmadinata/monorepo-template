import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getWorkerEnv } from "#/integrations/appenv/worker";
import { getAuth } from "#/integrations/auth/auth";
import {
    hasExistingUsers,
    getAuthSecondaryStorage,
} from "#/integrations/auth/utils";

export const getBootstrapState = createServerFn({ method: "GET" }).handler(
    async () => {
        const env = await getWorkerEnv();
        const hasUsers = await hasExistingUsers(env.MAIN_DB);

        return {
            hasUsers,
            isBootstrapOpen: !hasUsers,
        };
    }
);

export const getCurrentSession = createServerFn({ method: "GET" }).handler(
    async () => {
        const env = await getWorkerEnv();
        const secondaryStorage = getAuthSecondaryStorage(env.MAIN_KV);
        const headers = getRequestHeaders();
        const auth = getAuth({ db: env.MAIN_DB, secondaryStorage });

        return auth.api.getSession({ headers });
    }
);
