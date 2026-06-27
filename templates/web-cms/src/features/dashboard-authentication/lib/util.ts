export const dashboardAuthenticationPaths = {
    dashboard: "/dashboard",
    login: "/login",
    welcome: "/",
} as const;

export type DashboardAuthenticationIntent = "sign-in" | "sign-up";

export function getGoogleAuthRequest(intent: DashboardAuthenticationIntent) {
    const errorRoutePath =
        intent === "sign-up"
            ? dashboardAuthenticationPaths.welcome
            : dashboardAuthenticationPaths.login;

    return {
        callbackURL: dashboardAuthenticationPaths.dashboard,
        errorCallbackURL: errorRoutePath,
        newUserCallbackURL: dashboardAuthenticationPaths.dashboard,
    };
}
