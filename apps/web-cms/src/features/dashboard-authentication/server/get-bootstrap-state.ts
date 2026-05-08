import { createServerFn } from "@tanstack/react-start";

import { getMainDBBinding } from "#/integrations/appenv/worker";
import { hasExistingUsers } from "#/integrations/auth";

export const getBootstrapState = createServerFn({ method: "GET" }).handler(
    async () => {
        const hasUsers = await hasExistingUsers(getMainDBBinding());

        return {
            hasUsers,
            isBootstrapOpen: !hasUsers,
        };
    }
);
