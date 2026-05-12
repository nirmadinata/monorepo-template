import { dashboardAuthenticationPaths } from "../lib/util";
import { GoogleAuthPage } from "./organisms/google-auth-page";

export function LoginPage() {
    return (
        <GoogleAuthPage
            actionLabel="Sign in with Google"
            description="Return with the Google account already linked to this workspace."
            footerHref={dashboardAuthenticationPaths.welcome}
            footerLabel=""
            footerPrompt="Login to get into dashboard"
            intent="sign-in"
            title="Welcome back"
        />
    );
}
