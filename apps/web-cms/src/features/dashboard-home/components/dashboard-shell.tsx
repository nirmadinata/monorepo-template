import { Link } from "@tanstack/react-router";
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

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader className="gap-3 p-3">
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
                </SidebarHeader>

                <SidebarSeparator />

                <SidebarContent>
                    {dashboardNavigationGroups.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        if (item.kind === "link") {
                                            const Icon = item.icon;

                                            return (
                                                <SidebarMenuItem
                                                    key={item.label}
                                                >
                                                    <SidebarMenuButton
                                                        isActive={item.isActive}
                                                        render={
                                                            <Link
                                                                className="no-underline"
                                                                to={item.to}
                                                            />
                                                        }
                                                        tooltip={item.label}
                                                    >
                                                        <Icon />
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        }

                                        const Icon = item.icon;

                                        return (
                                            <SidebarMenuItem key={item.label}>
                                                <Collapsible
                                                    defaultOpen={
                                                        item.defaultOpen
                                                    }
                                                >
                                                    <CollapsibleTrigger
                                                        render={
                                                            <SidebarMenuButton />
                                                        }
                                                    >
                                                        <Icon />
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                        <ChevronRightIcon className="ml-auto transition-transform data-[panel-open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                                                    </CollapsibleTrigger>

                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.children.map(
                                                                (child) => (
                                                                    <SidebarMenuSubItem
                                                                        key={
                                                                            child.label
                                                                        }
                                                                    >
                                                                        <SidebarMenuSubButton
                                                                            isActive={
                                                                                child.isActive
                                                                            }
                                                                            render={
                                                                                <Link
                                                                                    className="no-underline"
                                                                                    to={
                                                                                        child.to
                                                                                    }
                                                                                />
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    child.label
                                                                                }
                                                                            </span>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                )
                                                            )}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarRail />
            </Sidebar>

            <SidebarInset className="min-h-screen bg-background">
                <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <SidebarTrigger />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                                    {DASHBOARD_BRAND_NAME}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {DASHBOARD_BRAND_TAGLINE}
                                </p>
                            </div>
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
