import { useForm } from "@tanstack/react-form";

import { runEmailSignUp } from "../lib/email-password-auth-action";
import { emailSignUpSchema } from "../lib/email-password-form-schema";

export function useEmailSignUpForm() {
    return useForm({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            await runEmailSignUp({ email: value.email, password: value.password });
        },
        validators: {
            onSubmit: emailSignUpSchema,
        },
    });
}
