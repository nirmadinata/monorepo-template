import { dashboardAuthenticationPaths } from "../lib/util";
import { AuthFormCard } from "./auth-form-card";
import { GoogleAuthButton } from "./molecules/google-auth-button";

export function WelcomePage() {
    return (
        <AuthFormCard
            description="This will setup your instance and create the first account with superadmin privileges."
            footerHref={dashboardAuthenticationPaths.login}
            footerLabel="Go to sign in"
            footerPrompt="Already have an approved account?"
            title="Create your first account"
        >
            <div className="space-y-5 text-sm text-muted-foreground">
                <GoogleAuthButton intent="sign-up">
                    Sign up with Google
                </GoogleAuthButton>
            </div>
        </AuthFormCard>
    );
}
