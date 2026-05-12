import { Link } from "@tanstack/react-router";

import { Card, CardContent, CardFooter } from "#/components/ui/card";

interface AuthFormCardTemplateProps {
    children: React.ReactNode;
    description: string;
    footerHref: string;
    footerLabel: string;
    footerPrompt: string;
    title: string;
}

export function AuthFormCardTemplate({
    children,
    description,
    footerHref,
    footerLabel,
    footerPrompt,
    title,
}: AuthFormCardTemplateProps) {
    return (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5 lg:pr-8">
                <p className="brand-kicker">Secure Access</p>
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {title}
                </h1>
                <p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-[0.98rem]">
                    {description}
                </p>
            </div>

            <Card className="w-full border border-border/80 bg-card/92 shadow-(--shadow-lg) backdrop-blur-xl">
                <CardContent className="space-y-6 py-6">{children}</CardContent>

                <CardFooter className="justify-center border-t border-border/70 bg-muted/30 text-center text-xs text-muted-foreground">
                    <p>
                        {footerPrompt}{" "}
                        <Link className="font-semibold text-foreground" to={footerHref}>
                            {footerLabel}
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
