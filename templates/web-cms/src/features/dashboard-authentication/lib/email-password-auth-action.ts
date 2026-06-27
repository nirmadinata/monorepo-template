import { createClientOnlyFn } from "@tanstack/react-start";

import { authClient } from "#/integrations/auth/client";

export const runEmailSignUp = createClientOnlyFn(
    async (params: { email: string; password: string }) => {
        const result = await authClient.signUp.email({
            email: params.email,
            password: params.password,
            name: params.email.split("@")[0],
            callbackURL: "/dashboard",
        });

        if (result?.error) {
            throw new Error(result.error.message || "Unable to create account.");
        }
    }
);

export const runEmailSignIn = createClientOnlyFn(
    async (params: { email: string; password: string }) => {
        const result = await authClient.signIn.email({
            email: params.email,
            password: params.password,
            callbackURL: "/dashboard",
            rememberMe: true,
        });

        if (result?.error) {
            throw new Error(result.error.message || "Invalid email or password.");
        }
    }
);
