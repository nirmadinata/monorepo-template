import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const appenv = createEnv({
    emptyStringAsUndefined: true,
    clientPrefix: "VITE_",
    runtimeEnv: {
        ...import.meta.env,
        ...process.env,
    },

    client: {
        VITE_APP_TITLE: z.string().min(1).optional(),
    },
    server: {
        SERVER_URL: z.string().url().optional(),
    },
});
