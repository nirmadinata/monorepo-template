import { Outlet, createFileRoute, getRouteApi } from "@tanstack/react-router";

import { DashboardShell } from "#/features/dashboard/components/dashboard-shell";
import { getDashboardSession } from "#/features/dashboard/server/get-dashboard-session";

export const Route = createFileRoute("/dashboard")({
    component: RouteComponent,
    loader: async () => getDashboardSession(),
});

const routeApi = getRouteApi("/dashboard");

function RouteComponent() {
    const session = routeApi.useLoaderData();

    return (
        <DashboardShell user={session.user}>
            <Outlet />
        </DashboardShell>
    );
}
