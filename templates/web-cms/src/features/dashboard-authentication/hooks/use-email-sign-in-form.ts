import { useForm } from "@tanstack/react-form";

import { runEmailSignIn } from "../lib/email-password-auth-action";
import { emailSignInSchema } from "../lib/email-password-form-schema";

export function useEmailSignInForm() {
    return useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            await runEmailSignIn({ email: value.email, password: value.password });
        },
        validators: {
            onSubmit: emailSignInSchema,
        },
    });
}
