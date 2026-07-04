import { createClientOnlyFn, createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import type { SecondaryStorage } from "better-auth";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { betterAuth } from "better-auth/minimal";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { appenv } from "../env/util";
import { getWorkerEnv } from "../workers/clients";
import { ac, ROLES, ROLES_ENUM } from "./constants";
import { getAuthAdapter, getAuthSecondaryStorage } from "./repository";
import { hasExistingUsers, parseTrustedOrigins, prepareBootstrapUser } from "./util";

// -- Auth Client (browser) --

export const getAuthClient = createClientOnlyFn(() =>
    createAuthClient({
        plugins: [adminClient({ ac, roles: ROLES }), inferAdditionalFields<AppAuth>()],
    })
);

// -- Auth Server --

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

// -- Server Functions --

export const getBootstrapState = createServerFn({ method: "GET" }).handler(async () => {
    const env = await getWorkerEnv();
    const hasUsers = await hasExistingUsers(env.MAIN_DB);

    return {
        hasUsers,
        isBootstrapOpen: !hasUsers,
    };
});

export const getCurrentSession = createServerFn({ method: "GET" }).handler(async () => {
    const env = await getWorkerEnv();
    const secondaryStorage = getAuthSecondaryStorage(env.MAIN_KV);
    const headers = getRequestHeaders();
    const auth = getAuth({ db: env.MAIN_DB, secondaryStorage });

    return auth.api.getSession({ headers });
});
