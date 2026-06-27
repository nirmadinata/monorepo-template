import { Button } from "#/components/ui/button";
import { FieldError } from "#/components/ui/field";
import { Spinner } from "#/components/ui/spinner";
import { submitForm } from "#/lib/forms";

import { useGoogleAuthForm } from "../../hooks/use-google-auth-form";
import type { DashboardAuthenticationIntent } from "../../lib/util";
import { GoogleMark } from "../atoms/google-mark";

interface GoogleAuthFormProps {
    actionLabel: string;
    intent: DashboardAuthenticationIntent;
}

export function GoogleAuthForm({ actionLabel, intent }: GoogleAuthFormProps) {
    const form = useGoogleAuthForm(intent);

    return (
        <form
            className="flex w-full max-w-sm flex-col items-stretch gap-3"
            onSubmit={(event) => {
                void submitForm(event, form, "Unable to start Google authentication.");
            }}
        >
            <form.Subscribe
                selector={(state) => ({
                    errors: state.errors,
                    isSubmitting: state.isSubmitting,
                })}
            >
                {({ errors, isSubmitting }) => (
                    <>
                        <Button disabled={isSubmitting} size="lg" type="submit">
                            {isSubmitting ? (
                                <Spinner data-icon="inline-start" />
                            ) : (
                                <GoogleMark data-icon="inline-start" />
                            )}
                            {actionLabel}
                        </Button>
                        <FieldError errors={errors} />
                    </>
                )}
            </form.Subscribe>
        </form>
    );
}
