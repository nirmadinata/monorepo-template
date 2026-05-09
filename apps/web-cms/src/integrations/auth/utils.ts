import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { createServerOnlyFn } from "@tanstack/react-start";
import type { SecondaryStorage } from "better-auth";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

import { dbSchema, getAppDB } from "#/integrations/db";

export const BOOTSTRAP_ADMIN_ROLE = "superadmin";

export const authSchema = {
    account: dbSchema.accounts,
    session: dbSchema.sessions,
    user: dbSchema.users,
    verification: dbSchema.verification,
};

export async function assertFirstUserSignupAllowed(checkForExistingUsers: () => Promise<boolean>) {
    if (await checkForExistingUsers()) {
        throw new APIError("FORBIDDEN", {
            message: "Sign up is closed after the first user.",
        });
    }
}

export async function prepareBootstrapUser<TUser extends object>(
    user: TUser & { role?: string | null },
    checkForExistingUsers: () => Promise<boolean>
) {
    await assertFirstUserSignupAllowed(checkForExistingUsers);

    return {
        ...user,
        role: BOOTSTRAP_ADMIN_ROLE,
    };
}

export function parseTrustedOrigins(value?: string) {
    if (!value) {
        return;
    }

    const origins = value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return origins.length > 0 ? origins : undefined;
}

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
    drizzleAdapter(getAppDB(db), {
        provider: "sqlite",
        schema: authSchema,
    })
);

let authAdapterSingleton: ReturnType<typeof createAuthAdapter> | undefined;

export const getAuthAdapter = createServerOnlyFn((db: D1Database) => {
    authAdapterSingleton ??= createAuthAdapter(db);

    return authAdapterSingleton;
});

export const hasExistingUsers = createServerOnlyFn(async (db: D1Database) => {
    const existingUsers = await getAppDB(db).$count(
        dbSchema.users,
        eq(dbSchema.users.id, dbSchema.users.id)
    );

    return existingUsers > 0;
});
