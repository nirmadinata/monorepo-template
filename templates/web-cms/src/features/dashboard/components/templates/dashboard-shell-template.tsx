import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon, SearchIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { ThemeToggle } from "#/components/theme-toggle";
import { Button } from "#/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "#/components/ui/collapsible";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "#/components/ui/command";
import { Kbd } from "#/components/ui/kbd";
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

import {
    DASHBOARD_BRAND_NAME,
    DASHBOARD_COMMAND_PALETTE,
    DASHBOARD_NAV_PATHS,
} from "../../lib/constants";
import { dashboardNavigationGroups } from "../../lib/navigation";
import type { DashboardNavigationGroup, DashboardNavigationItem } from "../../lib/navigation";
import type { DashboardSession } from "../../server/get-dashboard-session";
import { DashboardAccountMenu } from "../molecules/dashboard-account-menu";

type DashboardNavigationLinkItem = Extract<DashboardNavigationItem, { kind: "link" }>;

type DashboardNavigationParentItem = Extract<DashboardNavigationItem, { kind: "parent" }>;

interface DashboardCommandNavigationItem {
    icon: DashboardNavigationLinkItem["icon"];
    keywords: readonly string[];
    label: string;
    parentLabel?: string;
    to: DashboardNavigationLinkItem["to"];
}

interface DashboardCommandNavigationGroup {
    items: readonly DashboardCommandNavigationItem[];
    label: DashboardNavigationGroup["label"];
}

const dashboardCommandNavigationGroups: readonly DashboardCommandNavigationGroup[] =
    dashboardNavigationGroups.map((group) => ({
        label: group.label,
        items: group.items.flatMap((item) => {
            if (item.kind === "link") {
                return [
                    {
                        icon: item.icon,
                        keywords: [group.label, item.label],
                        label: item.label,
                        to: item.to,
                    },
                ];
            }

            return item.children.map((child) => ({
                icon: item.icon,
                keywords: [group.label, item.label, child.label],
                label: child.label,
                parentLabel: item.label,
                to: child.to,
            }));
        }),
    }));

function shouldPinSidebarFromClick(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    if (
        target.closest(
            [
                '[data-sidebar="menu"]',
                '[data-sidebar="menu-item"]',
                '[data-sidebar="menu-button"]',
                "a",
                "button",
                "input",
                "select",
                "textarea",
                '[role="button"]',
            ].join(", ")
        )
    ) {
        return false;
    }

    return Boolean(target.closest('[data-slot="sidebar-inner"]'));
}

function DashboardSidebarBrand() {
    return (
        <Link className="no-underline" to={DASHBOARD_NAV_PATHS.dashboard}>
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
            <SidebarMenuButton asChild isActive={item.isActive ?? isActive} tooltip={item.label}>
                <Link className="no-underline" to={item.to}>
                    <Icon />
                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function DashboardParentMenuItem({ item }: { item: DashboardNavigationParentItem }) {
    const Icon = item.icon;

    return (
        <SidebarMenuItem>
            <Collapsible defaultOpen={item.defaultOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <Icon />
                        <span>{item.label}</span>
                        <ChevronRightIcon className="ml-auto transition-transform group-data-[collapsible=icon]:hidden data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.label}>
                                <SidebarMenuSubButton isActive={child.isActive} asChild>
                                    <Link className="no-underline" to={child.to}>
                                        <span>{child.label}</span>
                                    </Link>
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

function DashboardSidebarCommandMenu({
    groups,
    onOpenChange,
    open,
}: {
    groups: readonly DashboardCommandNavigationGroup[];
    onOpenChange: (open: boolean) => void;
    open: boolean;
}) {
    const navigate = useNavigate();

    return (
        <CommandDialog
            description={DASHBOARD_COMMAND_PALETTE.description}
            onOpenChange={onOpenChange}
            open={open}
            title={DASHBOARD_COMMAND_PALETTE.title}
        >
            <Command>
                <CommandInput placeholder={DASHBOARD_COMMAND_PALETTE.inputPlaceholder} />
                <CommandList>
                    <CommandEmpty>{DASHBOARD_COMMAND_PALETTE.emptyText}</CommandEmpty>

                    {groups.map((group, index) => (
                        <Fragment key={group.label}>
                            {index > 0 ? <CommandSeparator /> : null}

                            <CommandGroup heading={group.label}>
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <CommandItem
                                            key={`${group.label}-${item.parentLabel ?? item.label}-${item.label}`}
                                            keywords={[...item.keywords]}
                                            onSelect={() => {
                                                onOpenChange(false);
                                                void navigate({ to: item.to });
                                            }}
                                            value={`${group.label} ${item.parentLabel ?? ""} ${item.label}`}
                                        >
                                            <Icon />

                                            <div className="flex min-w-0 flex-col gap-0.5">
                                                <span className="truncate">{item.label}</span>

                                                {item.parentLabel ? (
                                                    <span className="truncate text-xs text-muted-foreground">
                                                        {item.parentLabel}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </Fragment>
                    ))}
                </CommandList>
            </Command>
        </CommandDialog>
    );
}

interface DashboardShellTemplateProps {
    children: React.ReactNode;
    user: DashboardSession["user"];
}

export function DashboardShellTemplate({ children, user }: DashboardShellTemplateProps) {
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [isSidebarPinnedOpen, setIsSidebarPinnedOpen] = useState(false);
    const [isSidebarHovering, setIsSidebarHovering] = useState(false);

    const isSidebarOpen = isSidebarPinnedOpen || isSidebarHovering;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) {
                return;
            }

            event.preventDefault();
            setIsCommandOpen((open) => !open);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <SidebarProvider
            onOpenChange={(open) => {
                setIsSidebarPinnedOpen(open);

                if (open) {
                    setIsSidebarHovering(false);
                }
            }}
            open={isSidebarOpen}
        >
            <div
                onClickCapture={(event) => {
                    if (!isSidebarOpen || isSidebarPinnedOpen) {
                        return;
                    }

                    if (!shouldPinSidebarFromClick(event.target)) {
                        return;
                    }

                    setIsSidebarHovering(false);
                    setIsSidebarPinnedOpen(true);
                }}
                onMouseEnter={() => {
                    if (!isSidebarPinnedOpen) {
                        setIsSidebarHovering(true);
                    }
                }}
                onMouseLeave={() => {
                    setIsSidebarHovering(false);
                }}
            >
                <Sidebar
                    collapsible="icon"
                    variant="inset"
                    className="border-r border-sidebar-border"
                >
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
            </div>

            <SidebarInset className="min-h-screen bg-background">
                <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <SidebarTrigger />

                            <Button
                                className="min-w-0 justify-between gap-2 text-muted-foreground sm:min-w-72"
                                onClick={() => setIsCommandOpen(true)}
                                type="button"
                                variant="outline"
                            >
                                <span className="flex min-w-0 items-center gap-2 truncate">
                                    <SearchIcon data-icon="inline-start" />
                                    <span className="truncate">
                                        {DASHBOARD_COMMAND_PALETTE.triggerPlaceholder}
                                    </span>
                                </span>

                                <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <DashboardSidebarCommandMenu
                    groups={dashboardCommandNavigationGroups}
                    onOpenChange={setIsCommandOpen}
                    open={isCommandOpen}
                />

                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
