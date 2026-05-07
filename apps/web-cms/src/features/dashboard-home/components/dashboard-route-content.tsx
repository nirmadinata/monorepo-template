import type { DashboardSession } from "../server/get-dashboard-session";
import { DashboardHomePage } from "./dashboard-home-page";
import { DashboardShell } from "./dashboard-shell";

interface DashboardRouteContentProps {
    session: DashboardSession;
}

export function DashboardRouteContent({ session }: DashboardRouteContentProps) {
    return (
        <DashboardShell>
            <DashboardHomePage user={session.user} />
        </DashboardShell>
    );
}
