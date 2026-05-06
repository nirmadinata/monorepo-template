import { ShieldCheckIcon, SparklesIcon } from "lucide-react";

import { Separator } from "#/components/ui/separator";

import { dashboardAuthenticationPaths } from "../lib/util";
import { AuthFooterPrompt } from "./molecules/auth-footer-prompt";
import { AuthPointsList } from "./molecules/auth-points-list";
import { AuthStatusAlert } from "./molecules/auth-status-alert";
import { GoogleAuthButton } from "./molecules/google-auth-button";
import { AuthenticationCard } from "./organisms/auth-card";
import { AuthPageTemplate } from "./templates/auth-page-template";

export function WelcomePage() {
    return (
        <AuthPageTemplate
            badgeLabel="Bootstrap access"
            description="Activate the CMS with the first trusted Google account. The bootstrap account becomes the workspace superadmin and unlocks the rest of the editorial surface."
            highlights={
                <>
                    <AuthStatusAlert
                        icon={<ShieldCheckIcon />}
                        title="First account becomes superadmin"
                    >
                        Bootstrap elevation happens in the auth layer, so the
                        first approved Google identity is stored with the
                        required role before any dashboard work begins.
                    </AuthStatusAlert>

                    <Separator />

                    <AuthPointsList
                        items={[
                            {
                                icon: <SparklesIcon className="mt-0.5" />,
                                text: "Use the workspace owner's Google account to establish the initial administrator.",
                            },
                            {
                                icon: <SparklesIcon className="mt-0.5" />,
                                text: "After bootstrap closes, new identities are blocked unless they already have a linked account.",
                            },
                        ]}
                    />
                </>
            }
            highlightsDescription="Bootstrap access is intentionally narrow: only the first successful Google account can initialize the CMS."
            highlightsTitle="What happens next"
            title="Create the first workspace administrator"
        >
            <AuthenticationCard
                description="Use Google to create the first account and hand the CMS its initial superadmin."
                footer={
                    <AuthFooterPrompt
                        href={dashboardAuthenticationPaths.login}
                        linkLabel="Go to sign in"
                        prompt="Already have an approved account?"
                    />
                }
                title="Start bootstrap with Google"
            >
                <AuthStatusAlert
                    icon={<ShieldCheckIcon />}
                    title="One-time elevation"
                >
                    The first completed Google sign-in is persisted as
                    `superadmin`.
                </AuthStatusAlert>

                <Separator />

                <GoogleAuthButton intent="sign-up">
                    Sign up with Google
                </GoogleAuthButton>
            </AuthenticationCard>
        </AuthPageTemplate>
    );
}
