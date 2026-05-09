import type { DashboardAuthenticationIntent } from "../lib/util";
import { AuthFormCard } from "./auth-form-card";
import { GoogleAuthButton } from "./molecules/google-auth-button";

interface GoogleAuthPageProps {
    actionLabel: string;
    description: string;
    footerHref: string;
    footerLabel: string;
    footerPrompt: string;
    intent: DashboardAuthenticationIntent;
    title: string;
}

export function GoogleAuthPage({
    actionLabel,
    description,
    footerHref,
    footerLabel,
    footerPrompt,
    intent,
    title,
}: GoogleAuthPageProps) {
    return (
        <AuthFormCard
            description={description}
            footerHref={footerHref}
            footerLabel={footerLabel}
            footerPrompt={footerPrompt}
            title={title}
        >
            <div className="space-y-5 text-sm text-muted-foreground">
                <GoogleAuthButton intent={intent}>{actionLabel}</GoogleAuthButton>
            </div>
        </AuthFormCard>
    );
}
