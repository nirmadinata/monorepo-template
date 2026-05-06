import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";

interface AuthHighlightsPanelProps {
    children: React.ReactNode;
    description: string;
    title: string;
}

export function AuthHighlightsPanel({
    children,
    description,
    title,
}: AuthHighlightsPanelProps) {
    return (
        <Card className="max-w-xl" size="sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {children}
            </CardContent>
        </Card>
    );
}
