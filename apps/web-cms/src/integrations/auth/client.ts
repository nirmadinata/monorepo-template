import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { AppAuth } from "#/integrations/auth/auth";
import { ac, ROLES } from "#/integrations/auth/permissions";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: ROLES,
        }),
        inferAdditionalFields<AppAuth>(),
    ],
});
