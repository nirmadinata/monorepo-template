import { Navigate, createFileRoute } from "@tanstack/react-router";

import { WelcomePage } from "#/features/dashboard-authentication/components/welcome-page";
import { getBootstrapState } from "#/integrations/auth";

export const Route = createFileRoute("/_auth/")({
    loader: async () => getBootstrapState(),
    component: WelcomeRoute,
});

function WelcomeRoute() {
    const bootstrapState = Route.useLoaderData();

    if (!bootstrapState.isBootstrapOpen) {
        return <Navigate replace to="/login" />;
    }

    return <WelcomePage />;
}
