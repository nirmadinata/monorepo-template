import {
    BookOpenIcon,
    FolderKanbanIcon,
    ImagesIcon,
    LayoutDashboardIcon,
    PenSquareIcon,
    Settings2Icon,
    UsersIcon,
} from "lucide-react";
import type { ComponentType } from "react";

import type { DashboardNavigationRoute } from "./constants";
import { DASHBOARD_NAV_PATHS } from "./constants";

interface DashboardNavigationLinkItem {
    icon: ComponentType<{ className?: string }>;
    isActive?: boolean;
    kind: "link";
    label: string;
    to: DashboardNavigationRoute;
}

interface DashboardNavigationParentChild {
    isActive?: boolean;
    label: string;
    to: DashboardNavigationRoute;
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
                to: DASHBOARD_NAV_PATHS.dashboard,
            },
            {
                icon: ImagesIcon,
                kind: "link",
                label: "Media Manager",
                to: DASHBOARD_NAV_PATHS.media,
            },
            {
                children: [
                    {
                        isActive: true,
                        label: "All posts",
                        to: DASHBOARD_NAV_PATHS.posts,
                    },
                    { label: "Draft queue", to: DASHBOARD_NAV_PATHS.dashboard },
                    { label: "Publishing calendar", to: DASHBOARD_NAV_PATHS.dashboard },
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
                    { label: "Editorial playbooks", to: DASHBOARD_NAV_PATHS.dashboard },
                    { label: "Campaign folders", to: DASHBOARD_NAV_PATHS.dashboard },
                ],
                icon: FolderKanbanIcon,
                kind: "parent",
                label: "Projects",
            },
            {
                icon: BookOpenIcon,
                kind: "link",
                label: "Guidelines",
                to: DASHBOARD_NAV_PATHS.dashboard,
            },
            {
                icon: UsersIcon,
                kind: "link",
                label: "Contributors",
                to: DASHBOARD_NAV_PATHS.dashboard,
            },
            {
                children: [
                    { label: "Theme settings", to: DASHBOARD_NAV_PATHS.dashboard },
                    { label: "Access policies", to: DASHBOARD_NAV_PATHS.dashboard },
                ],
                icon: Settings2Icon,
                kind: "parent",
                label: "Configuration",
            },
        ],
    },
] as const;
