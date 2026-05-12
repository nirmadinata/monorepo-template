import type { DashboardSession } from "../server/get-dashboard-session";
import { DashboardShellTemplate } from "./templates/dashboard-shell-template";

interface DashboardShellProps {
    children: React.ReactNode;
    user: DashboardSession["user"];
}

export function DashboardShell({ children, user }: DashboardShellProps) {
    return <DashboardShellTemplate user={user}>{children}</DashboardShellTemplate>;
}
