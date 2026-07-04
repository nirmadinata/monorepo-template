import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { createServerOnlyFn } from "@tanstack/react-start";
import type { SecondaryStorage } from "better-auth";

import { getDB } from "#/integrations/clients/db";
import { authSchema } from "#/integrations/lib/auth/bootstrap";

export const createAuthSecondaryStorage = createServerOnlyFn(
    (storage: KVNamespace) =>
        ({
            delete: (key: string) => storage.delete(key),
            get: (key: string) => storage.get(key),
            set: (key: string, value: string, ttl?: number) =>
                storage.put(key, value, ttl ? { expirationTtl: ttl } : undefined),
        }) as SecondaryStorage
);

let authSecondaryStorageSingleton: ReturnType<typeof createAuthSecondaryStorage> | null = null;

export const getAuthSecondaryStorage = createServerOnlyFn((storage: KVNamespace) => {
    authSecondaryStorageSingleton ??= createAuthSecondaryStorage(storage);
    return authSecondaryStorageSingleton;
});

const createAuthAdapter = createServerOnlyFn((db: D1Database) =>
    drizzleAdapter(getDB(db), {
        provider: "sqlite",
        schema: authSchema,
    })
);

let authAdapterSingleton: ReturnType<typeof createAuthAdapter> | undefined;

export const getAuthAdapter = createServerOnlyFn((db: D1Database) => {
    authAdapterSingleton ??= createAuthAdapter(db);

    return authAdapterSingleton;
});
