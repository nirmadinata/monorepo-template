import { createServerOnlyFn } from "@tanstack/react-start";
import type { SecondaryStorage } from "better-auth";
import { betterAuth } from "better-auth/minimal";
import { openAPI } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { appenv } from "#/integrations/appenv";
import {
    getAuthAdapter,
    hasExistingUsers,
    parseTrustedOrigins,
    prepareBootstrapUser,
} from "#/integrations/auth/utils";

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
