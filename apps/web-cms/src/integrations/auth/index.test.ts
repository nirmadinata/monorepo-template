// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

interface MockAppDB {
    select: ReturnType<typeof vi.fn<() => unknown>>;
}

const mocks = vi.hoisted(() => ({
    appDB: { select: vi.fn<() => unknown>() },
    betterAuthSpy: vi.fn<
        (options: unknown) => {
            handler: ReturnType<typeof vi.fn<() => unknown>>;
        }
    >(() => ({ handler: vi.fn<() => unknown>() })),
    drizzleAdapterSpy: vi.fn<(db: unknown, config: unknown) => { adapter: true }>(() => ({
        adapter: true,
    })),
    getAppDBSpy: vi.fn<(dbBinding?: D1Database) => MockAppDB>(() => ({
        select: vi.fn<() => unknown>(),
    })),
    openAPISpy: vi.fn<() => { id: string }>(() => ({ id: "open-api" })),
    tanstackStartCookiesSpy: vi.fn<() => { id: string }>(() => ({
        id: "tanstack-start-cookies",
    })),
}));

vi.mock(import("#/integrations/appenv"), () => ({
    appenv: {
        BETTER_AUTH_SECRET: "test-secret",
        BETTER_AUTH_TRUSTED_ORIGINS: undefined,
        BETTER_AUTH_URL: "http://localhost:3000",
        GOOGLE_CLIENT_ID: "google-client-id",
        GOOGLE_CLIENT_SECRET: "google-client-secret",
        PUBLIC_API_DESCRIPTION: "Public API foundation for the web CMS.",
        PUBLIC_API_TITLE: "Web CMS Public API",
        PUBLIC_API_VERSION: "0.1.0",
        VITE_APP_TITLE: "web-cms",
    },
}));

vi.mock(import("#/integrations/db"), () => ({
    dbSchema: {
        accounts: { name: "accounts" },
        sessions: { name: "sessions" },
        users: { id: "users.id", name: "users" },
        verification: { name: "verification" },
    },
    getAppDB: mocks.getAppDBSpy,
}));

vi.mock(import("./utils"), () => ({
    prepareBootstrapUser: vi.fn<
        (user: Record<string, unknown>) => Promise<Record<string, unknown>>
    >(async (user) => user),
}));

vi.mock(import("@better-auth/drizzle-adapter"), () => ({
    drizzleAdapter: mocks.drizzleAdapterSpy,
}));

vi.mock(import("better-auth/minimal"), () => ({
    betterAuth: mocks.betterAuthSpy,
}));

vi.mock(import("better-auth/plugins"), () => ({
    openAPI: mocks.openAPISpy,
}));

vi.mock(import("better-auth/tanstack-start"), () => ({
    tanstackStartCookies: mocks.tanstackStartCookiesSpy,
}));

describe("getAuth", () => {
    beforeEach(() => {
        mocks.appDB = { select: vi.fn<() => unknown>() };
        mocks.getAppDBSpy.mockReset();
        mocks.getAppDBSpy.mockReturnValue(mocks.appDB);
        mocks.drizzleAdapterSpy.mockClear();
        mocks.betterAuthSpy.mockClear();
        mocks.openAPISpy.mockClear();
        mocks.tanstackStartCookiesSpy.mockClear();
    });

    it("passes the Drizzle client to the Better Auth adapter", async () => {
        const dbBinding = {
            prepare: vi.fn<() => unknown>(),
        } as unknown as D1Database;
        const { getAuth } = await import("./index");

        getAuth({ db: dbBinding });

        expect(mocks.getAppDBSpy).toHaveBeenCalledWith(dbBinding);
        expect(mocks.drizzleAdapterSpy).toHaveBeenCalledWith(mocks.appDB, {
            provider: "sqlite",
            schema: {
                account: { name: "accounts" },
                session: { name: "sessions" },
                user: { id: "users.id", name: "users" },
                verification: { name: "verification" },
            },
        });
    });
});
