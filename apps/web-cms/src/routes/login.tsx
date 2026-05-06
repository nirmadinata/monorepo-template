import { Navigate, createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "#/features/dashboard-authentication/components/login-page";
import { getBootstrapState } from "#/features/dashboard-authentication/server/get-bootstrap-state";

export const Route = createFileRoute("/login")({
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
