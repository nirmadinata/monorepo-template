import { Link, Outlet } from "@tanstack/react-router";
import { ChevronRightIcon, ChevronsLeftRightEllipsisIcon } from "lucide-react";

import { ThemeToggle } from "#/components/theme-toggle";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "#/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
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

import {
    DASHBOARD_BRAND_NAME,
    DASHBOARD_BRAND_TAGLINE,
    dashboardNavigationGroups,
} from "../lib/navigation";
import type {
    DashboardNavigationGroup,
    DashboardNavigationItem,
} from "../lib/navigation";

type DashboardNavigationLinkItem = Extract<
    DashboardNavigationItem,
    { kind: "link" }
>;

type DashboardNavigationParentItem = Extract<
    DashboardNavigationItem,
    { kind: "parent" }
>;

function DashboardSidebarBrand() {
    return (
        <Link className="no-underline" to="/dashboard">
            <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-sidebar-border/70 bg-sidebar-accent/50 px-3 py-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-border/80 bg-sidebar text-sidebar-foreground shadow-sm">
                    <ChevronsLeftRightEllipsisIcon />
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-semibold tracking-tight">
                        {DASHBOARD_BRAND_NAME}
                    </p>
                    <p className="truncate text-xs text-sidebar-foreground/70">
                        {DASHBOARD_BRAND_TAGLINE}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function DashboardHeaderBrand() {
    return (
        <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                {DASHBOARD_BRAND_NAME}
            </p>
            <p className="truncate text-xs text-muted-foreground">
                {DASHBOARD_BRAND_TAGLINE}
            </p>
        </div>
    );
}

function DashboardLinkMenuItem({
    item,
}: {
    item: DashboardNavigationLinkItem;
}) {
    const Icon = item.icon;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                isActive={item.isActive}
                render={<Link className="no-underline" to={item.to} />}
                tooltip={item.label}
            >
                <Icon />
                <span>{item.label}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function DashboardParentMenuItem({
    item,
}: {
    item: DashboardNavigationParentItem;
}) {
    const Icon = item.icon;

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={item.defaultOpen}>
                <CollapsibleTrigger render={<SidebarMenuButton />}>
                    <Icon />
                    <span>{item.label}</span>
                    <ChevronRightIcon className="ml-auto transition-transform data-[panel-open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.label}>
                                <SidebarMenuSubButton
                                    isActive={child.isActive}
                                    render={
                                        <Link
                                            className="no-underline"
                                            to={child.to}
                                        />
                                    }
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

function DashboardNavigationMenuItem({
    item,
}: {
    item: DashboardNavigationItem;
}) {
    if (item.kind === "link") {
        return <DashboardLinkMenuItem item={item} />;
    }

    return <DashboardParentMenuItem item={item} />;
}

function DashboardSidebarNavigation({
    groups,
}: {
    groups: readonly DashboardNavigationGroup[];
}) {
    return groups.map((group) => (
        <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {group.items.map((item) => (
                        <DashboardNavigationMenuItem
                            key={item.label}
                            item={item}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    ));
}

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell(_: DashboardShellProps) {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader className="gap-3 p-3">
                    <DashboardSidebarBrand />
                </SidebarHeader>

                <SidebarSeparator />

                <SidebarContent>
                    <DashboardSidebarNavigation
                        groups={dashboardNavigationGroups}
                    />
                </SidebarContent>

                <SidebarRail />
            </Sidebar>

            <SidebarInset className="min-h-screen bg-background">
                <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <SidebarTrigger />
                            <DashboardHeaderBrand />
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
