import { createFileRoute } from "@tanstack/react-router";

import { DashboardHomePage } from "#/features/dashboard-home/components/dashboard-home-page";

function DashboardRoute() {
    return <DashboardHomePage />;
}

export const Route = createFileRoute("/dashboard/")({
    component: DashboardRoute,
});
