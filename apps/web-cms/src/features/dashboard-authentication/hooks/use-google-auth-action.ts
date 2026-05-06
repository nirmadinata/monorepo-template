import { useState } from "react";

import { authClient } from "#/integrations/auth/client";

import { getGoogleAuthRequest } from "../lib/util";
import type { DashboardAuthenticationIntent } from "../lib/util";

const DEFAULT_ERROR_MESSAGE = "Unable to start Google authentication.";

export function useGoogleAuthAction(intent: DashboardAuthenticationIntent) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    async function run() {
        setErrorMessage(null);
        setIsPending(true);

        try {
            const result = await authClient.signIn.social({
                provider: "google",
                ...getGoogleAuthRequest(intent),
            });

            if (result?.error) {
                setErrorMessage(result.error.message ?? DEFAULT_ERROR_MESSAGE);
            }
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE
            );
        } finally {
            setIsPending(false);
        }
    }

    return {
        errorMessage,
        isPending,
        run,
    };
}
