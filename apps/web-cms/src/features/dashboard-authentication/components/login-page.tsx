import { dashboardAuthenticationPaths } from "../lib/util";
import { GoogleAuthPage } from "./google-auth-page";

export function LoginPage() {
    return (
        <GoogleAuthPage
            actionLabel="Sign in with Google"
            description="Return with the Google account already linked to this workspace."
            footerHref={dashboardAuthenticationPaths.welcome}
            footerLabel="Return to welcome"
            footerPrompt="Need to bootstrap this instance first?"
            intent="sign-in"
            title="Welcome back"
        />
    );
}
