import { useForm } from "@tanstack/react-form";

import { googleAuthSubmissionSchema } from "../lib/form-schema";
import { runGoogleAuthAction } from "../lib/google-auth-action";
import type { DashboardAuthenticationIntent } from "../lib/util";

export function useGoogleAuthForm(intent: DashboardAuthenticationIntent) {
    return useForm({
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
}
