import { redirect } from "@tanstack/react-router";

import { getCurrentSession } from "#/features/dashboard-authentication/server/get-current-session";

export type DashboardSession = NonNullable<
    Awaited<ReturnType<typeof getCurrentSession>>
>;

export async function getDashboardSession() {
    const session = await getCurrentSession();

    if (!session) {
        throw redirect({ to: "/login" });
    }

    return session;
}
