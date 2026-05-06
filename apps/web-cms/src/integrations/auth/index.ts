import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import type { SecondaryStorage } from "better-auth";
import { betterAuth } from "better-auth/minimal";
import { openAPI } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { appenv } from "#/integrations/appenv";
import { dbSchema, getAppDB } from "#/integrations/db";

import { assertFirstUserSignupAllowed } from "./utils";

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

async function hasExistingUsers(db: D1Database) {
    const existingUsers = await getAppDB(db)
        .select({ id: dbSchema.users.id })
        .from(dbSchema.users)
        .limit(1);

    return existingUsers.length > 0;
}

function createAuthAdapter(db: D1Database) {
    return drizzleAdapter(db, {
        provider: "sqlite",
        schema: authSchema,
    });
}

let authAdapterSingleton: ReturnType<typeof createAuthAdapter> | undefined;

function getAuthAdapter(db: D1Database) {
    authAdapterSingleton ??= createAuthAdapter(db);

    return authAdapterSingleton;
}

interface AuthParam {
    db?: D1Database;
    secondaryStorage?: SecondaryStorage;
}

function createAuth(params: AuthParam) {
    const database = params.db ? getAuthAdapter(params.db) : undefined;
    const { secondaryStorage } = params;

    return betterAuth({
        database,
        secondaryStorage,
        appName: appenv.VITE_APP_TITLE ?? "web-cms",
        baseURL: appenv.BETTER_AUTH_URL,
        databaseHooks: {
            user: {
                create: {
                    async before(user) {
                        if (params.db) {
                            const { db } = params;
                            await assertFirstUserSignupAllowed(() =>
                                hasExistingUsers(db)
                            );
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
}

let authSingleton: ReturnType<typeof createAuth> | undefined;

export function getAuth(params: AuthParam) {
    authSingleton ??= createAuth(params);
    return authSingleton;
}

export type AuthSession = ReturnType<typeof getAuth>["$Infer"]["Session"];
export type AuthUser = AuthSession["user"];
