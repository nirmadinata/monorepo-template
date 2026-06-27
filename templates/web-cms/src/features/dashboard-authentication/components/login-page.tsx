import { GoogleAuthForm } from "./organisms/google-auth-form";

export function LoginPage() {
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-xl font-medium">Sign in</h1>
            <p className="text-sm text-muted-foreground">
                Continue with the Google account linked to this workspace.
            </p>
            <GoogleAuthForm actionLabel="Sign in with Google" intent="sign-in" />
        </div>
    );
}
