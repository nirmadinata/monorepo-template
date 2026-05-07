import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { DashboardHomePage } from "#/features/dashboard-home/components/dashboard-home-page";

export const Route = createFileRoute("/dashboard/")({
    component: DashboardRoute,
});

function DashboardRoute() {
    const session = useLoaderData({
        from: "/dashboard",
    });

    return <DashboardHomePage user={session.user} />;
}
