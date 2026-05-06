import { Badge } from "#/components/ui/badge";

import { AuthHeroCopy } from "../atoms/auth-hero-copy";
import { AuthHighlightsPanel } from "../organisms/auth-highlights-panel";

interface AuthPageTemplateProps {
    badgeLabel: string;
    children: React.ReactNode;
    description: string;
    highlights: React.ReactNode;
    highlightsDescription: string;
    highlightsTitle: string;
    title: string;
}

export function AuthPageTemplate({
    badgeLabel,
    children,
    description,
    highlights,
    highlightsDescription,
    highlightsTitle,
    title,
}: AuthPageTemplateProps) {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
                <section className="flex flex-1 flex-col gap-6">
                    <Badge variant="secondary">{badgeLabel}</Badge>
                    <AuthHeroCopy description={description} title={title} />
                    <AuthHighlightsPanel
                        description={highlightsDescription}
                        title={highlightsTitle}
                    >
                        {highlights}
                    </AuthHighlightsPanel>
                </section>

                <section className="w-full max-w-lg">{children}</section>
            </div>
        </main>
    );
}
