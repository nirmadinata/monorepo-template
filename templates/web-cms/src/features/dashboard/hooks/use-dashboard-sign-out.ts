import { useState } from "react";
import { toast } from "sonner";

import { getAuthClient } from "#/integrations/clients/auth";

import { DASHBOARD_PATHS, DEFAULT_SIGN_OUT_ERROR_MESSAGE } from "../lib/constants";

export function useDashboardSignOut() {
    const [isSigningOut, setIsSigningOut] = useState(false);

    async function signOut() {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);

        try {
            const result = await getAuthClient().signOut();

            if (result?.error) {
                toast.error(result.error.message || DEFAULT_SIGN_OUT_ERROR_MESSAGE);

                return;
            }

            window.location.assign(DASHBOARD_PATHS.login);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : DEFAULT_SIGN_OUT_ERROR_MESSAGE);
        } finally {
            setIsSigningOut(false);
        }
    }

    return {
        isSigningOut,
        signOut,
    };
}
