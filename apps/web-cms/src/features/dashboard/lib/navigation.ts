import {
    BookOpenIcon,
    FolderKanbanIcon,
    LayoutDashboardIcon,
    PenSquareIcon,
    Settings2Icon,
    UsersIcon,
} from "lucide-react";
import type { ComponentType } from "react";

export const DASHBOARD_BRAND_NAME = "Mock CMS";
export const DASHBOARD_BRAND_TAGLINE = "Admin workspace";

interface DashboardNavigationLinkItem {
    icon: ComponentType<{ className?: string }>;
    isActive?: boolean;
    kind: "link";
    label: string;
    to: "/dashboard";
}

interface DashboardNavigationParentChild {
    isActive?: boolean;
    label: string;
    to: "/dashboard";
}

interface DashboardNavigationParentItem {
    children: readonly DashboardNavigationParentChild[];
    defaultOpen?: boolean;
    icon: ComponentType<{ className?: string }>;
    kind: "parent";
    label: string;
}

export type DashboardNavigationItem = DashboardNavigationLinkItem | DashboardNavigationParentItem;

export interface DashboardNavigationGroup {
    items: readonly DashboardNavigationItem[];
    label: string;
}

export const dashboardNavigationGroups: readonly DashboardNavigationGroup[] = [
    {
        label: "Workspace",
        items: [
            {
                icon: LayoutDashboardIcon,
                isActive: true,
                kind: "link",
                label: "Overview",
                to: "/dashboard",
            },
            {
                children: [
                    {
                        isActive: true,
                        label: "All posts",
                        to: "/dashboard",
                    },
                    { label: "Draft queue", to: "/dashboard" },
                    { label: "Publishing calendar", to: "/dashboard" },
                ],
                defaultOpen: true,
                icon: PenSquareIcon,
                kind: "parent",
                label: "Content",
            },
        ],
    },
    {
        label: "Operations",
        items: [
            {
                children: [
                    { label: "Editorial playbooks", to: "/dashboard" },
                    { label: "Campaign folders", to: "/dashboard" },
                ],
                icon: FolderKanbanIcon,
                kind: "parent",
                label: "Projects",
            },
            {
                icon: BookOpenIcon,
                kind: "link",
                label: "Guidelines",
                to: "/dashboard",
            },
            {
                icon: UsersIcon,
                kind: "link",
                label: "Contributors",
                to: "/dashboard",
            },
            {
                children: [
                    { label: "Theme settings", to: "/dashboard" },
                    { label: "Access policies", to: "/dashboard" },
                ],
                icon: Settings2Icon,
                kind: "parent",
                label: "Configuration",
            },
        ],
    },
] as const;
