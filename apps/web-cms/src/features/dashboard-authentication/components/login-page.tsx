import { dashboardAuthenticationPaths } from "../lib/util";
import { AuthFormCard } from "./auth-form-card";
import { GoogleAuthButton } from "./molecules/google-auth-button";

export function LoginPage() {
    return (
        <AuthFormCard
            description="Return with the Google account already linked to this workspace."
            footerHref={dashboardAuthenticationPaths.welcome}
            footerLabel="Return to welcome"
            footerPrompt="Need to bootstrap this instance first?"
            title="Welcome back"
        >
            <div className="space-y-5 text-sm text-muted-foreground">
                <GoogleAuthButton intent="sign-in">
                    Sign in with Google
                </GoogleAuthButton>
            </div>
        </AuthFormCard>
    );
}
