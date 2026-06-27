import { useForm } from "@tanstack/react-form";

import { runEmailSignIn, runEmailSignUp } from "../lib/email-password-auth-action";
import { emailSignInSchema, emailSignUpSchema } from "../lib/email-password-form-schema";
import type { EmailPasswordFormValues } from "../lib/email-password-form-schema";
import type { DashboardAuthenticationIntent } from "../lib/util";

export function useEmailPasswordForm(intent: DashboardAuthenticationIntent) {
    return useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        } as EmailPasswordFormValues,
        onSubmit: async ({ value }) => {
            await (intent === "sign-up"
                ? runEmailSignUp({ email: value.email, password: value.password })
                : runEmailSignIn({ email: value.email, password: value.password }));
        },
        validators: {
            onSubmit: intent === "sign-up" ? emailSignUpSchema : emailSignInSchema,
        },
    });
}
