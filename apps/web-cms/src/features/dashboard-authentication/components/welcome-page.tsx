import { dashboardAuthenticationPaths } from "../lib/util";
import { GoogleAuthPage } from "./google-auth-page";

export function WelcomePage() {
    return (
        <GoogleAuthPage
            actionLabel="Sign up with Google"
            description="This will setup your instance and create the first account with superadmin privileges."
            footerHref={dashboardAuthenticationPaths.login}
            footerLabel="Go to sign in"
            footerPrompt="Already have an approved account?"
            intent="sign-up"
            title="Create your first account"
        />
    );
}
