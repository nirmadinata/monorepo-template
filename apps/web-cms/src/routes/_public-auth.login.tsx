import { Navigate, createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "#/features/dashboard-authentication/components/login-page";
import { getBootstrapState } from "#/integrations/auth";

export const Route = createFileRoute("/_public-auth/login")({
    loader: async () => getBootstrapState(),
    component: LoginRoute,
});

function LoginRoute() {
    const bootstrapState = Route.useLoaderData();

    if (bootstrapState.isBootstrapOpen) {
        return <Navigate replace to="/" />;
    }

    return <LoginPage />;
}
