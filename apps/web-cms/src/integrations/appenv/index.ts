import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const appenv = createEnv({
    clientPrefix: "VITE_",
    emptyStringAsUndefined: true,
    runtimeEnv: { ...import.meta.env, ...process.env },

    client: {
        VITE_APP_TITLE: z.string().min(1).optional(),
    },

    server: {
        BUCKET_NAME: z.string().min(1),

        BETTER_AUTH_SECRET: z.string().min(32),
        BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
        BETTER_AUTH_URL: z.url(),

        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),

        PUBLIC_API_DESCRIPTION: z.string().min(1).default("Public API foundation for the web CMS."),
        PUBLIC_API_TITLE: z.string().min(1).default("Web CMS Public API"),
        PUBLIC_API_VERSION: z.string().min(1).default("0.1.0"),
    },
});
