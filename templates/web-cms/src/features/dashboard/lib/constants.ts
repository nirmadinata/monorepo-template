export const DASHBOARD_NAV_PATHS = {
    dashboard: "/dashboard",
    media: "/dashboard/media",
    posts: "/dashboard/posts",
} as const;

export const DASHBOARD_PATHS = {
    ...DASHBOARD_NAV_PATHS,
    login: "/login",
} as const;

export type DashboardNavigationRoute =
    (typeof DASHBOARD_NAV_PATHS)[keyof typeof DASHBOARD_NAV_PATHS];

export const DASHBOARD_BRAND_NAME = "Mock CMS";

export const DASHBOARD_ACCOUNT = {
    defaultDisplayName: "Dashboard User",
    defaultAvatarFallback: "DU",
    labels: {
        profile: "Profile",
        signOut: "Sign out",
        signingOut: "Signing out...",
    },
    getAriaLabel: (name: string) => `${name} account menu`,
} as const;

export const DASHBOARD_COMMAND_PALETTE = {
    title: "Navigate Dashboard",
    description: "Search dashboard destinations from the sidebar menu.",
    inputPlaceholder: "Search sidebar destinations...",
    emptyText: "No matching dashboard destination found.",
    triggerPlaceholder: "Search sidebar menu...",
} as const;

export const DEFAULT_SIGN_OUT_ERROR_MESSAGE = "Unable to sign out right now.";
