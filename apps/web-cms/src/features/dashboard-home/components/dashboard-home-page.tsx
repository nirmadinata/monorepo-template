import type { DashboardSession } from "#/features/dashboard/server/get-dashboard-session";

import { DashboardHomeTemplate } from "./templates/dashboard-home-template";

interface DashboardHomePageProps {
    user: DashboardSession["user"];
}

export function DashboardHomePage({ user }: DashboardHomePageProps) {
    return <DashboardHomeTemplate user={user} />;
}
