export const dashboardAuthenticationPaths = {
    login: "/login",
    welcome: "/",
} as const;

export type DashboardAuthenticationIntent = "sign-in" | "sign-up";

export function getGoogleAuthRequest(intent: DashboardAuthenticationIntent) {
    const routePath =
        intent === "sign-up"
            ? dashboardAuthenticationPaths.welcome
            : dashboardAuthenticationPaths.login;

    return {
        callbackURL: routePath,
        errorCallbackURL: routePath,
        newUserCallbackURL: dashboardAuthenticationPaths.welcome,
    };
}
