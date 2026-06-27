import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "#/integrations/auth/client";

const DEFAULT_SIGN_OUT_ERROR_MESSAGE = "Unable to sign out right now.";

export function useDashboardSignOut() {
    const [isSigningOut, setIsSigningOut] = useState(false);

    async function signOut() {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);

        try {
            const result = await authClient.signOut();

            if (result?.error) {
                toast.error(result.error.message || DEFAULT_SIGN_OUT_ERROR_MESSAGE);

                return;
            }

            window.location.assign("/login");
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
