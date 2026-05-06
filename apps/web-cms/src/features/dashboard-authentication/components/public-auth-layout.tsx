import { Link, Outlet } from "@tanstack/react-router";

import { ThemeToggle } from "#/components/theme-toggle";

export function PublicAuthLayout() {
    return (
        <div className="min-h-screen">
            <header className="border-b border-border/70 bg-background/72 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link className="no-underline" to="/">
                        <div className="flex items-center gap-3 text-foreground">
                            <span className="font-semibold tracking-tight">
                                Mock CMS
                            </span>
                            <span className="h-4 w-px bg-border/80" />
                            <span className="text-xs text-muted-foreground">
                                Admin workspace
                            </span>
                        </div>
                    </Link>

                    <ThemeToggle />
                </div>
            </header>

            <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 py-14 sm:px-6 sm:py-20">
                <div className="w-full max-w-4xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
