import { createServerOnlyFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const getWorkerEnv = createServerOnlyFn(() => env);
export const getMainDBBinding = createServerOnlyFn(
    () => getWorkerEnv().MAIN_DB
);
