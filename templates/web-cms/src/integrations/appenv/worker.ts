import { createServerOnlyFn } from "@tanstack/react-start";

export const getWorkerEnv = createServerOnlyFn(async () => {
    const { env } = await import("cloudflare:workers");

    return env;
});
export const getMainDBBinding = createServerOnlyFn(async () => {
    const env = await getWorkerEnv();
    return env.MAIN_DB;
});
