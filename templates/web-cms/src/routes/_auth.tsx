import { createFileRoute } from "@tanstack/react-router";

import { PublicAuthLayout } from "#/features/dashboard-authentication/components/public-auth-layout";

export const Route = createFileRoute("/_auth")({
    component: PublicAuthLayout,
});
