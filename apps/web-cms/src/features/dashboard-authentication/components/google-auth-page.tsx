import { useForm } from "@tanstack/react-form";

import { Button } from "#/components/ui/button";
import { FieldError } from "#/components/ui/field";
import { Spinner } from "#/components/ui/spinner";
import { submitForm } from "#/lib/forms";

import { runGoogleAuthAction } from "../hooks/use-google-auth-action";
import { googleAuthSubmissionSchema } from "../lib/form-schema";
import type { DashboardAuthenticationIntent } from "../lib/util";
import { GoogleMark } from "./atoms/google-mark";
import { AuthFormCard } from "./auth-form-card";

interface GoogleAuthPageProps {
    actionLabel: string;
    description: string;
    footerHref: string;
    footerLabel: string;
    footerPrompt: string;
    intent: DashboardAuthenticationIntent;
    title: string;
}

export function GoogleAuthPage({
    actionLabel,
    description,
    footerHref,
    footerLabel,
    footerPrompt,
    intent,
    title,
}: GoogleAuthPageProps) {
    const form = useForm({
        defaultValues: {
            intent,
        },
        onSubmit: async ({ value }) => {
            await runGoogleAuthAction(value.intent);
        },
        validators: {
            onSubmit: googleAuthSubmissionSchema,
        },
    });

    return (
        <AuthFormCard
            description={description}
            footerHref={footerHref}
            footerLabel={footerLabel}
            footerPrompt={footerPrompt}
            title={title}
        >
            <form
                className="space-y-5 text-sm text-muted-foreground"
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
        </AuthFormCard>
    );
}
