import { authClient } from "#/integrations/auth/client";

import { getGoogleAuthRequest } from "../lib/util";
import type { DashboardAuthenticationIntent } from "../lib/util";

const DEFAULT_ERROR_MESSAGE = "Unable to start Google authentication.";

export async function runGoogleAuthAction(intent: DashboardAuthenticationIntent) {
    const result = await authClient.signIn.social({
        provider: "google",
        ...getGoogleAuthRequest(intent),
    });

    if (result?.error) {
        throw new Error(result.error.message || DEFAULT_ERROR_MESSAGE);
    }
}
