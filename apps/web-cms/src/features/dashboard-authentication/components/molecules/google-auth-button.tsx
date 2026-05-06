import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";

import { useGoogleAuthAction } from "../../hooks/use-google-auth-action";
import type { DashboardAuthenticationIntent } from "../../lib/util";
import { GoogleMark } from "../atoms/google-mark";

interface GoogleAuthButtonProps {
    children: React.ReactNode;
    intent: DashboardAuthenticationIntent;
}

export function GoogleAuthButton({ children, intent }: GoogleAuthButtonProps) {
    const { isPending, run } = useGoogleAuthAction(intent);

    return (
        <div className="flex flex-col gap-3">
            <Button
                disabled={isPending}
                onClick={() => void run()}
                size="lg"
                type="button"
            >
                {isPending ? (
                    <Spinner data-icon="inline-start" />
                ) : (
                    <GoogleMark data-icon="inline-start" />
                )}
                {children}
            </Button>
        </div>
    );
}
