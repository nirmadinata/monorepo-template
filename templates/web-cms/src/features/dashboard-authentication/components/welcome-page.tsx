import { EmailSignUpForm } from "./organisms/email-sign-up-form";
import { GoogleAuthForm } from "./organisms/google-auth-form";

export function WelcomePage() {
    return (
        <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-xl font-medium">Create your first account</h1>
                <p className="text-sm text-muted-foreground">
                    Sign up with email and password to bootstrap this instance.
                </p>
            </div>
            <EmailSignUpForm />
            <div className="flex w-full max-w-sm items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <div className="h-px flex-1 bg-border" />
            </div>
            <GoogleAuthForm actionLabel="Sign up with Google" intent="sign-up" variant="outline" />
        </div>
    );
}
