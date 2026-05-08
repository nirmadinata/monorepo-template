import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { createServerOnlyFn } from "@tanstack/react-start";
import type { SecondaryStorage } from "better-auth";
import { betterAuth } from "better-auth/minimal";
import { openAPI } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";

import { appenv } from "#/integrations/appenv";
import { dbSchema, getAppDB } from "#/integrations/db";

import { prepareBootstrapUser } from "./utils";

const authSchema = {
    account: dbSchema.accounts,
    session: dbSchema.sessions,
    user: dbSchema.users,
    verification: dbSchema.verification,
};

function parseTrustedOrigins(value?: string) {
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
                storage.put(
                    key,
                    value,
                    ttl ? { expirationTtl: ttl } : undefined
                ),
        }) as SecondaryStorage
);

let authSecondaryStorageSingleton: ReturnType<
    typeof createAuthSecondaryStorage
> | null = null;

export const getAuthSecondaryStorage = createServerOnlyFn(
    (storage: KVNamespace) => {
        authSecondaryStorageSingleton ??= createAuthSecondaryStorage(storage);
        return authSecondaryStorageSingleton;
    }
);

const createAuthAdapter = createServerOnlyFn((db: D1Database) =>
    drizzleAdapter(getAppDB(db), {
        provider: "sqlite",
        schema: authSchema,
    })
);

let authAdapterSingleton: ReturnType<typeof createAuthAdapter> | undefined;

const getAuthAdapter = createServerOnlyFn((db: D1Database) => {
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

interface AuthParam {
    db?: D1Database;
    secondaryStorage?: SecondaryStorage;
}

const createAuth = createServerOnlyFn(({ db, secondaryStorage }: AuthParam) => {
    const database = db ? getAuthAdapter(db) : undefined;

    return betterAuth({
        database,
        secondaryStorage,
        appName: appenv.VITE_APP_TITLE ?? "web-cms",
        baseURL: appenv.BETTER_AUTH_URL,
        databaseHooks: {
            user: {
                create: {
                    async before(user) {
                        if (db) {
                            const bootstrapUser = await prepareBootstrapUser(
                                {
                                    role: user.role as string,
                                },
                                () => hasExistingUsers(db)
                            );

                            return { data: bootstrapUser };
                        }

                        return { data: user };
                    },
                },
            },
        },
        disabledPaths: ["/sign-in/email", "/sign-up/email"],
        emailAndPassword: {
            enabled: false,
        },
        plugins: [openAPI(), tanstackStartCookies()],
        secret: appenv.BETTER_AUTH_SECRET,
        socialProviders: {
            google: {
                clientId: appenv.GOOGLE_CLIENT_ID,
                clientSecret: appenv.GOOGLE_CLIENT_SECRET,
                prompt: "select_account",
            },
        },
        trustedOrigins: parseTrustedOrigins(appenv.BETTER_AUTH_TRUSTED_ORIGINS),
        account: {
            accountLinking: {
                enabled: false,
            },
            encryptOAuthTokens: true,
            updateAccountOnSignIn: true,
        },
        advanced: {
            cookiePrefix: "web-cms-auth",
            ipAddress: {
                ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"],
            },
        },
        session: {
            cookieCache: {
                enabled: true,
                maxAge: 60 * 5,
            },
        },
    });
});

let authSingleton: ReturnType<typeof createAuth> | undefined;

export const getAuth = createServerOnlyFn((params: AuthParam) => {
    authSingleton ??= createAuth(params);
    return authSingleton;
});

export type AuthSession = ReturnType<typeof getAuth>["$Infer"]["Session"];
export type AuthUser = AuthSession["user"];
