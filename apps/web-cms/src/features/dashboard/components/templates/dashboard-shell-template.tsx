import { Link, useMatchRoute } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

import { ThemeToggle } from "#/components/theme-toggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from "#/components/ui/sidebar";

import { DASHBOARD_BRAND_NAME, dashboardNavigationGroups } from "../../lib/navigation";
import type { DashboardNavigationGroup, DashboardNavigationItem } from "../../lib/navigation";
import type { DashboardSession } from "../../server/get-dashboard-session";
import { DashboardAccountMenu } from "../molecules/dashboard-account-menu";

type DashboardNavigationLinkItem = Extract<DashboardNavigationItem, { kind: "link" }>;

type DashboardNavigationParentItem = Extract<DashboardNavigationItem, { kind: "parent" }>;

function DashboardSidebarBrand() {
    return (
        <Link className="no-underline" to="/dashboard">
            <div className="flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-sidebar-border/70 bg-sidebar-accent/50 px-3 py-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-semibold tracking-tight">
                        {DASHBOARD_BRAND_NAME}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function DashboardLinkMenuItem({ item }: { item: DashboardNavigationLinkItem }) {
    const Icon = item.icon;
    const matchRoute = useMatchRoute();
    const isActive = Boolean(matchRoute({ to: item.to }));

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                isActive={item.isActive ?? isActive}
                render={<Link className="no-underline" to={item.to} />}
                tooltip={item.label}
            >
                <Icon />
                <span>{item.label}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function DashboardParentMenuItem({ item }: { item: DashboardNavigationParentItem }) {
    const Icon = item.icon;

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={item.defaultOpen}>
                <CollapsibleTrigger render={<SidebarMenuButton />}>
                    <Icon />
                    <span>{item.label}</span>
                    <ChevronRightIcon className="ml-auto transition-transform group-data-[collapsible=icon]:hidden data-panel-open:rotate-90" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.label}>
                                <SidebarMenuSubButton
                                    isActive={child.isActive}
                                    render={<Link className="no-underline" to={child.to} />}
                                >
                                    <span>{child.label}</span>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}

function DashboardNavigationMenuItem({ item }: { item: DashboardNavigationItem }) {
    if (item.kind === "link") {
        return <DashboardLinkMenuItem item={item} />;
    }

    return <DashboardParentMenuItem item={item} />;
}

function DashboardSidebarNavigation({ groups }: { groups: readonly DashboardNavigationGroup[] }) {
    return groups.map((group) => (
        <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {group.items.map((item) => (
                        <DashboardNavigationMenuItem key={item.label} item={item} />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    ));
}

interface DashboardShellTemplateProps {
    children: React.ReactNode;
    user: DashboardSession["user"];
}

export function DashboardShellTemplate({ children, user }: DashboardShellTemplateProps) {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader className="gap-3 p-3">
                    <DashboardSidebarBrand />
                </SidebarHeader>

                <SidebarSeparator />

                <SidebarContent>
                    <DashboardSidebarNavigation groups={dashboardNavigationGroups} />
                </SidebarContent>

                <SidebarSeparator />

                <SidebarFooter className="p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
                    <DashboardAccountMenu user={user} />
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>

            <SidebarInset className="min-h-screen bg-background">
                <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <SidebarTrigger />
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
