import { createFileRoute, redirect } from "@tanstack/react-router";

import { WelcomePage } from "#/features/dashboard-authentication/components/welcome-page";
import { getBootstrapState } from "#/integrations/auth";

async function loader() {
    const state = await getBootstrapState();

    if (!state.isBootstrapOpen) {
        throw redirect({ to: "/login" });
    }
}

export const Route = createFileRoute("/_auth/")({
    loader,
    component: WelcomeRoute,
});

function WelcomeRoute() {
    return <WelcomePage />;
}
