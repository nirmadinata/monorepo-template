import { createFileRoute } from "@tanstack/react-router";

import { DashboardRouteContent } from "#/features/dashboard-home/components/dashboard-route-content";
import { getDashboardSession } from "#/features/dashboard-home/server/get-dashboard-session";

export const Route = createFileRoute("/dashboard")({
    loader: async () => getDashboardSession(),
    component: DashboardRoute,
});

function DashboardRoute() {
    const session = Route.useLoaderData();

    return <DashboardRouteContent session={session} />;
}
