import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { AppAuth } from "#/integrations/clients/auth-server";
import { ac, ROLES } from "#/integrations/constants/auth";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: ROLES,
        }),
        inferAdditionalFields<AppAuth>(),
    ],
});
