import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const appenv = createEnv({
    clientPrefix: "VITE_",
    emptyStringAsUndefined: true,
    runtimeEnv: {
        ...import.meta.env,
        ...process.env,
    },

    client: {
        VITE_APP_TITLE: v.optional(v.pipe(v.string(), v.nonEmpty()), "Web CMS"),
    },

    server: {
        BUCKET_NAME: v.pipe(v.string(), v.nonEmpty()),
        R2_ACCOUNT_ID: v.pipe(v.string(), v.nonEmpty()),
        R2_ACCESS_KEY_ID: v.pipe(v.string(), v.nonEmpty()),
        R2_SECRET_ACCESS_KEY: v.pipe(v.string(), v.nonEmpty()),

        BETTER_AUTH_SECRET: v.pipe(v.string(), v.nonEmpty(), v.minLength(32)),
        BETTER_AUTH_TRUSTED_ORIGINS: v.optional(v.pipe(v.string(), v.nonEmpty())),
        BETTER_AUTH_URL: v.pipe(v.string(), v.url()),

        GOOGLE_CLIENT_ID: v.pipe(v.string(), v.nonEmpty()),
        GOOGLE_CLIENT_SECRET: v.pipe(v.string(), v.nonEmpty()),
    },
});
