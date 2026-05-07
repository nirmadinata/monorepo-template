import { Button } from "#/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";

import type { DashboardSession } from "../server/get-dashboard-session";

interface DashboardHomePageProps {
    user: DashboardSession["user"];
}

export function DashboardHomePage({ user }: DashboardHomePageProps) {
    return (
        <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div className="flex flex-col gap-5">
                    <p className="brand-kicker">Dashboard Home</p>
                    <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                        A professional workspace, ready for content.
                    </h1>
                    <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                        You are signed in as {user.email}. This landing view is
                        intentionally restrained so the product feels clear,
                        professional, and focused from the first screen.
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
                    <CardContent className="flex flex-col gap-5 py-6 text-sm text-muted-foreground">
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
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <Card className="border-border/75 bg-card/80 shadow-none">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Current status
                        </CardTitle>
                        <CardDescription>
                            Example shell content for future CMS screens.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Navigation examples stay presentational for now, so the
                        shell can evolve without requiring new backend routes.
                    </CardContent>
                </Card>

                <Card className="border-border/75 bg-card/80 shadow-none">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                            Editorial workflow
                        </CardTitle>
                        <CardDescription>
                            Grouped navigation supports direct and nested
                            states.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Use the sidebar to preview a direct link row, open
                        nested menu sections, and the collapsed desktop shell
                        layout.
                    </CardContent>
                </Card>

                <Card className="border-border/75 bg-card/80 shadow-none">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Next step</CardTitle>
                        <CardDescription>
                            The dashboard home feature now owns this route
                            shell.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Additional authenticated views can land inside this
                        feature boundary instead of growing the route file.
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
