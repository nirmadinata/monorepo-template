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
                <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3">
                    <p className="leading-6">
                        Returning access only. New identities stay blocked once
                        bootstrap is complete.
                    </p>
                </div>
                <p className="leading-6">
                    Sign in to continue to the dashboard with your approved
                    account and existing permissions.
                </p>
                <GoogleAuthButton intent="sign-in">
                    Sign in with Google
                </GoogleAuthButton>
            </div>
        </AuthFormCard>
    );
}
