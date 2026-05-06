import { env } from "cloudflare:workers";

export type AppWorkerEnv = typeof env;

export function getWorkerEnv(): AppWorkerEnv {
    return env;
}

export function getMainDBBinding() {
    return getWorkerEnv().MAIN_DB;
}
