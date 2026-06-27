import { GoogleAuthForm } from "./organisms/google-auth-form";

export function WelcomePage() {
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-xl font-medium">Create your first account</h1>
            <p className="text-sm text-muted-foreground">
                Sign up with Google to bootstrap this instance and create the first superadmin.
            </p>
            <GoogleAuthForm actionLabel="Sign up with Google" intent="sign-up" />
        </div>
    );
}
