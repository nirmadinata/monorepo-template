import { AuthLink } from "../atoms/auth-link";

interface AuthFooterPromptProps {
    href: string;
    linkLabel: string;
    prompt: string;
}

export function AuthFooterPrompt({
    href,
    linkLabel,
    prompt,
}: AuthFooterPromptProps) {
    return (
        <>
            <span>{prompt}</span>
            <AuthLink href={href}>{linkLabel}</AuthLink>
        </>
    );
}
