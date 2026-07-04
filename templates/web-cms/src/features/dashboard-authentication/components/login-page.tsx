import { EmailSignInForm } from "./organisms/email-sign-in-form";
import { GoogleAuthForm } from "./organisms/google-auth-form";

export function LoginPage() {
    return (
        <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-xl font-medium">Sign in</h1>
                <p className="text-sm text-muted-foreground">
                    Sign in with your email and password.
                </p>
            </div>
            <EmailSignInForm />
            <div className="flex w-full max-w-sm items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <div className="h-px flex-1 bg-border" />
            </div>
            <GoogleAuthForm actionLabel="Sign in with Google" intent="sign-in" variant="outline" />
        </div>
    );
}
