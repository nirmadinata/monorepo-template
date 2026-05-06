import { LogInIcon, ShieldCheckIcon } from "lucide-react";

import { Separator } from "#/components/ui/separator";

import { dashboardAuthenticationPaths } from "../lib/util";
import { AuthFooterPrompt } from "./molecules/auth-footer-prompt";
import { AuthPointsList } from "./molecules/auth-points-list";
import { AuthStatusAlert } from "./molecules/auth-status-alert";
import { GoogleAuthButton } from "./molecules/google-auth-button";
import { AuthenticationCard } from "./organisms/auth-card";
import { AuthPageTemplate } from "./templates/auth-page-template";

export function LoginPage() {
    return (
        <AuthPageTemplate
            badgeLabel="Registered access"
            description="Return with the Google account that is already linked to the CMS. New identities are rejected once bootstrap has completed."
            highlights={
                <>
                    <AuthStatusAlert
                        icon={<LogInIcon />}
                        title="Returning users only"
                    >
                        This page is for identities that already belong to the
                        workspace. First-user onboarding stays on the welcome
                        route.
                    </AuthStatusAlert>

                    <Separator />

                    <AuthPointsList
                        items={[
                            {
                                icon: <ShieldCheckIcon className="mt-0.5" />,
                                text: "Existing linked Google accounts can continue to sign in after bootstrap closes.",
                            },
                            {
                                icon: <ShieldCheckIcon className="mt-0.5" />,
                                text: "The auth layer still enforces first-user-only account creation on the server.",
                            },
                        ]}
                    />
                </>
            }
            highlightsDescription="Sign in uses the same Google provider, but account creation remains closed for unrecognized identities."
            highlightsTitle="Access policy"
            title="Welcome back to the editorial workspace"
        >
            <AuthenticationCard
                description="Sign in with the Google identity that is already linked to your CMS user."
                footer={
                    <AuthFooterPrompt
                        href={dashboardAuthenticationPaths.welcome}
                        linkLabel="Return to welcome"
                        prompt="Need to bootstrap this instance first?"
                    />
                }
                title="Continue with Google"
            >
                <AuthStatusAlert
                    icon={<LogInIcon />}
                    title="Known account required"
                >
                    Use your existing Google-linked CMS identity to open the
                    workspace.
                </AuthStatusAlert>

                <Separator />

                <GoogleAuthButton intent="sign-in">
                    Sign in with Google
                </GoogleAuthButton>
            </AuthenticationCard>
        </AuthPageTemplate>
    );
}
