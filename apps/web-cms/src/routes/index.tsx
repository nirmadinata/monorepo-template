import { Navigate, createFileRoute } from "@tanstack/react-router";

import { WelcomePage } from "#/features/dashboard-authentication/components/welcome-page";
import { getBootstrapState } from "#/features/dashboard-authentication/server/get-bootstrap-state";

export const Route = createFileRoute("/")({
    loader: async () => getBootstrapState(),
    component: Home,
});

function Home() {
    const bootstrapState = Route.useLoaderData();

    if (!bootstrapState.isBootstrapOpen) {
        return <Navigate replace to="/login" />;
    }

    return <WelcomePage />;
}
