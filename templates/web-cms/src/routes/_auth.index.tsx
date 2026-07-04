import { createFileRoute, redirect } from "@tanstack/react-router";

import { WelcomePage } from "#/features/dashboard-authentication/components/welcome-page";
import { getBootstrapState } from "#/integrations/auth/clients";

function WelcomeRoute() {
    return <WelcomePage />;
}

export const Route = createFileRoute("/_auth/")({
    loader: async () => {
        const state = await getBootstrapState();

        if (!state.isBootstrapOpen) {
            throw redirect({ to: "/login" });
        }
    },
    component: WelcomeRoute,
});
