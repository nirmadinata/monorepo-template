import { createServerFn } from "@tanstack/react-start";

import { createBootstrapState } from "#/features/dashboard-authentication/lib/bootstrap-state";

export function readBootstrapState(hasUsers: boolean) {
    return createBootstrapState(hasUsers);
}

export const getBootstrapState = createServerFn({ method: "GET" }).handler(
    async () => {
        const [{ getMainDBBinding }, { hasExistingUsers }] = await Promise.all([
            import("#/integrations/appenv/worker"),
            import("#/integrations/auth"),
        ]);

        const hasUsers = await hasExistingUsers(getMainDBBinding());

        return readBootstrapState(hasUsers);
    }
);
