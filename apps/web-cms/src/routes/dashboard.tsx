import { createFileRoute, redirect } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import { getCurrentSession } from "#/features/dashboard-authentication/server/get-current-session";

export const Route = createFileRoute("/dashboard")({
    loader: async () => {
        const session = await getCurrentSession();

        if (!session) {
            throw redirect({ to: "/login" });
        }

        return session;
    },
    component: DashboardRoute,
});

function DashboardRoute() {
    const session = Route.useLoaderData();

    return (
        <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-14 sm:px-6 sm:py-20">
            <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div className="space-y-5">
                    <p className="brand-kicker">Dashboard Home</p>
                    <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                        A professional workspace, ready for content.
                    </h1>
                    <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                        You are signed in as {session.user.email}. This landing
                        view is intentionally restrained so the product feels
                        clear, professional, and focused from the first screen.
                    </p>
                </div>

                <Card className="w-full border border-border/80 bg-card/92 shadow-(--shadow-lg) backdrop-blur-xl">
                    <CardHeader className="border-b border-border/70 pb-5">
                        <CardTitle className="text-lg font-semibold tracking-tight">
                            Dashboard
                        </CardTitle>
                        <CardDescription>
                            Signed in and ready to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 py-6 text-sm text-muted-foreground">
                        <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3">
                            <p className="leading-6">
                                The authentication flow is complete and the new
                                monochrome SaaS shell is active across public
                                and authenticated routes.
                            </p>
                        </div>
                        <Button className="w-fit px-5" type="button">
                            Start editing
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
