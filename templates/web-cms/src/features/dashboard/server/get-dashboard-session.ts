import { redirect } from "@tanstack/react-router";

import { getCurrentSession } from "#/integrations/auth/clients";

import { DASHBOARD_PATHS } from "../lib/constants";

export type DashboardSession = NonNullable<Awaited<ReturnType<typeof getCurrentSession>>>;

export async function getDashboardSession() {
    const session = await getCurrentSession();

    if (!session) {
        throw redirect({ to: DASHBOARD_PATHS.login });
    }

    return session;
}
