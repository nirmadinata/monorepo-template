import { Outlet, createFileRoute, getRouteApi } from "@tanstack/react-router";

import { DashboardShell } from "#/features/dashboard/components/dashboard-shell";
import { getDashboardSession } from "#/features/dashboard/server/get-dashboard-session";

const api = getRouteApi("/dashboard");

function RouteComponent() {
    const session = api.useLoaderData();

    return (
        <DashboardShell user={session.user}>
            <Outlet />
        </DashboardShell>
    );
}

export const Route = createFileRoute("/dashboard")({
    component: RouteComponent,
    loader: async () => getDashboardSession(),
});
