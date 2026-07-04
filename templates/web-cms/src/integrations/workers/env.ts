import { createServerOnlyFn } from "@tanstack/react-start";

export const getWorkerEnv = createServerOnlyFn(async () => {
    const { env } = await import("cloudflare:workers");

    return env;
});
