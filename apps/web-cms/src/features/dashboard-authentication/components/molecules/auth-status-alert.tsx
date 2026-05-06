import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";

interface AuthStatusAlertProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    title: string;
}

export function AuthStatusAlert({
    children,
    icon,
    title,
}: AuthStatusAlertProps) {
    return (
        <Alert>
            {icon}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{children}</AlertDescription>
        </Alert>
    );
}
