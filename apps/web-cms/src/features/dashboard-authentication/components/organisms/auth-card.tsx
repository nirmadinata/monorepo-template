import { Badge } from "#/components/ui/badge";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";

interface AuthenticationCardProps {
    children: React.ReactNode;
    description: string;
    footer: React.ReactNode;
    title: string;
}

export function AuthenticationCard({
    children,
    description,
    footer,
    title,
}: AuthenticationCardProps) {
    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <CardAction>
                    <Badge variant="outline">Google OAuth</Badge>
                </CardAction>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {children}
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                {footer}
            </CardFooter>
        </Card>
    );
}
