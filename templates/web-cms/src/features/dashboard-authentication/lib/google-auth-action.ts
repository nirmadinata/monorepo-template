import { createClientOnlyFn } from "@tanstack/react-start";

import { authClient } from "#/integrations/clients/auth";

import { getGoogleAuthRequest } from "./util";
import type { DashboardAuthenticationIntent } from "./util";

const DEFAULT_ERROR_MESSAGE = "Unable to start Google authentication.";

export const runGoogleAuthAction = createClientOnlyFn(
    async (intent: DashboardAuthenticationIntent) => {
        const result = await authClient.signIn.social({
            provider: "google",
            ...getGoogleAuthRequest(intent),
        });

        if (result?.error) {
            throw new Error(result.error.message || DEFAULT_ERROR_MESSAGE);
        }
    }
);
