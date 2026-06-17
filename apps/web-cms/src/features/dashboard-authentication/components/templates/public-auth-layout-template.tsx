import { Outlet } from "@tanstack/react-router";

import { ThemeToggle } from "#/components/theme-toggle";

export function PublicAuthLayoutTemplate() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex items-center justify-end px-4 py-3">
                <ThemeToggle />
            </div>

            <main className="flex flex-1 items-center justify-center px-4">
                <Outlet />
            </main>
        </div>
    );
}
