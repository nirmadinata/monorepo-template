import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
    ClientOnly,
    HeadContent,
    Scripts,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { AppThemeProvider } from "#/components/theme-provider";
import { Toaster } from "#/components/ui/sonner";
import TanStackQueryDevtools from "#/integrations/tanstack-query/devtools";

import appCss from "#/styles.css?url";

interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        links: [
            {
                href: appCss,
                rel: "stylesheet",
            },
        ],
        meta: [
            {
                charSet: "utf-8",
            },
            {
                content: "width=device-width, initial-scale=1",
                name: "viewport",
            },
            {
                title: "TanStack Start Starter",
            },
        ],
    }),
    notFoundComponent: RootNotFound,
    shellComponent: RootDocument,
});

function RootNotFound() {
    return <p className="px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">Not found.</p>;
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <AppThemeProvider>
                    {children}
                    <ClientOnly>
                        <Toaster position="top-right" richColors />
                    </ClientOnly>
                    <TanStackDevtools
                        config={{
                            position: "bottom-right",
                        }}
                        plugins={[
                            {
                                name: "Tanstack Router",
                                render: <TanStackRouterDevtoolsPanel />,
                            },
                            TanStackQueryDevtools,
                        ]}
                    />
                </AppThemeProvider>
                <Scripts />
            </body>
        </html>
    );
}
