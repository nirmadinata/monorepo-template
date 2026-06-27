import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Field, FieldContent, FieldError, FieldTitle } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Spinner } from "#/components/ui/spinner";
import { getManagedFieldProps, submitForm } from "#/lib/forms";

import { useEmailPasswordForm } from "../../hooks/use-email-password-form";
import type { DashboardAuthenticationIntent } from "../../lib/util";

interface EmailPasswordFormProps {
    intent: DashboardAuthenticationIntent;
}

export function EmailPasswordForm({ intent }: EmailPasswordFormProps) {
    const form = useEmailPasswordForm(intent);
    const isSignUp = intent === "sign-up";

    return (
        <form
            className="w-full max-w-sm"
            onSubmit={(event) => {
                void submitForm(
                    event,
                    form,
                    isSignUp ? "Unable to create account." : "Unable to sign in."
                );
            }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>{isSignUp ? "Create account" : "Welcome back"}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form.Field name="email">
                        {(field) => (
                            <Field>
                                <FieldTitle>Email</FieldTitle>
                                <FieldContent>
                                    <Input
                                        {...getManagedFieldProps(field)}
                                        autoComplete="email"
                                        onChange={(event) =>
                                            field.handleChange(event.currentTarget.value)
                                        }
                                        placeholder="you@example.com"
                                        type="email"
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </FieldContent>
                            </Field>
                        )}
                    </form.Field>
                    <form.Field name="password">
                        {(field) => (
                            <Field>
                                <FieldTitle>Password</FieldTitle>
                                <FieldContent>
                                    <Input
                                        {...getManagedFieldProps(field)}
                                        autoComplete={
                                            isSignUp ? "new-password" : "current-password"
                                        }
                                        onChange={(event) =>
                                            field.handleChange(event.currentTarget.value)
                                        }
                                        placeholder={
                                            isSignUp ? "Create a password" : "Your password"
                                        }
                                        type="password"
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </FieldContent>
                            </Field>
                        )}
                    </form.Field>
                    {isSignUp && (
                        <form.Field name="confirmPassword">
                            {(field) => (
                                <Field>
                                    <FieldTitle>Confirm password</FieldTitle>
                                    <FieldContent>
                                        <Input
                                            {...getManagedFieldProps(field)}
                                            autoComplete="new-password"
                                            onChange={(event) =>
                                                field.handleChange(event.currentTarget.value)
                                            }
                                            placeholder="Confirm your password"
                                            type="password"
                                        />
                                        <FieldError errors={field.state.meta.errors} />
                                    </FieldContent>
                                </Field>
                            )}
                        </form.Field>
                    )}
                    <form.Subscribe
                        selector={(state) => ({
                            errors: state.errors,
                            isSubmitting: state.isSubmitting,
                        })}
                    >
                        {({ errors, isSubmitting }) => (
                            <>
                                <Button
                                    className="w-full"
                                    disabled={isSubmitting}
                                    size="lg"
                                    type="submit"
                                >
                                    {isSubmitting && <Spinner data-icon="inline-start" />}
                                    {isSignUp ? "Create account" : "Sign in"}
                                </Button>
                                <FieldError errors={errors} />
                            </>
                        )}
                    </form.Subscribe>
                </CardContent>
            </Card>
        </form>
    );
}
