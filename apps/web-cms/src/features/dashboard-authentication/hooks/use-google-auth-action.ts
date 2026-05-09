import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "#/integrations/auth/client";

import { getGoogleAuthRequest } from "../lib/util";
import type { DashboardAuthenticationIntent } from "../lib/util";

const DEFAULT_ERROR_MESSAGE = "Unable to start Google authentication.";

export function useGoogleAuthAction(intent: DashboardAuthenticationIntent) {
    const [isPending, setIsPending] = useState(false);

    async function run() {
        setIsPending(true);

        try {
            const result = await authClient.signIn.social({
                provider: "google",
                ...getGoogleAuthRequest(intent),
            });

            if (result?.error) {
                toast.error(result.error.message || DEFAULT_ERROR_MESSAGE);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE);
        } finally {
            setIsPending(false);
        }
    }

    return {
        isPending,
        run,
    };
}
