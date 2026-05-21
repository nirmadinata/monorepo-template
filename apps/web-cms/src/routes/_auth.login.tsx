import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginPage } from "#/features/dashboard-authentication/components/login-page";
import { getBootstrapState, getCurrentSession } from "#/integrations/auth";

async function loader() {
    const session = await getCurrentSession();

    if (session?.session) {
        throw redirect({ to: "/dashboard" });
    }

    const state = await getBootstrapState();

    if (state.isBootstrapOpen) {
        throw redirect({ to: "/" });
    }
}

export const Route = createFileRoute("/_auth/login")({
    loader,
    component: LoginRoute,
});

function LoginRoute() {
    return <LoginPage />;
}
