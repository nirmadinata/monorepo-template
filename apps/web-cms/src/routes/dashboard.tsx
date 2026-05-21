import { Outlet, createFileRoute } from "@tanstack/react-router";

import { DashboardShell } from "#/features/dashboard/components/dashboard-shell";
import { getDashboardSession } from "#/features/dashboard/server/get-dashboard-session";

export const Route = createFileRoute("/dashboard")({
    component: RouteComponent,
    loader: async () => getDashboardSession(),
});

function RouteComponent() {
    const session = Route.useLoaderData();

    return (
        <DashboardShell user={session.user}>
            <Outlet />
        </DashboardShell>
    );
}
