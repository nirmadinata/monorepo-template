import { createServerOnlyFn } from "@tanstack/react-start";
import type { SecondaryStorage } from "better-auth";
import { betterAuth } from "better-auth/minimal";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { ac, ROLES, ROLES_ENUM } from "#/integrations/constants/auth";
import { getAuthAdapter } from "#/integrations/lib/auth/adapter";
import {
    hasExistingUsers,
    parseTrustedOrigins,
    prepareBootstrapUser,
} from "#/integrations/lib/auth/bootstrap";
import { appenv } from "#/integrations/lib/env";

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
                    async after(_user) {
                        // No-op: domain-specific seeding has been removed.
                    },
                },
            },
        },
        emailAndPassword: {
            enabled: true,
            minPasswordLength: 8,
            maxPasswordLength: 256,
        },
        plugins: [
            adminPlugin({
                ac,
                roles: ROLES,
                defaultRole: ROLES_ENUM.ADMIN,
                adminRoles: [ROLES_ENUM.ADMIN, ROLES_ENUM.SUPERADMIN],
            }),
            openAPI(),
            tanstackStartCookies(),
        ],
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

export type AppAuth = ReturnType<typeof getAuth>;
export type AuthSession = AppAuth["$Infer"]["Session"];
export type AuthUser = AuthSession["user"];
