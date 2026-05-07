import { createFileRoute, Outlet } from "@tanstack/react-router";

import { DashboardShell } from "#/features/dashboard-home/components/dashboard-shell";
import { getDashboardSession } from "#/features/dashboard-home/server/get-dashboard-session";

export const Route = createFileRoute("/dashboard")({
    component: RouteComponent,
    loader: async () => getDashboardSession(),
});

function RouteComponent() {
    return (
        <DashboardShell>
            <Outlet />
        </DashboardShell>
    );
}
