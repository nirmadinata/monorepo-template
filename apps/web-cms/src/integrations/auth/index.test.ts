// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    appDB: { select: vi.fn() },
    betterAuthSpy: vi.fn(() => ({ handler: vi.fn() })),
    drizzleAdapterSpy: vi.fn(() => ({ adapter: true })),
    getAppDBSpy: vi.fn(() => ({ select: vi.fn() })),
    openAPISpy: vi.fn(() => ({ id: "open-api" })),
    tanstackStartCookiesSpy: vi.fn(() => ({ id: "tanstack-start-cookies" })),
}));

vi.mock(import("#/integrations/appenv"), () => ({
    appenv: {
        BETTER_AUTH_SECRET: "test-secret",
        BETTER_AUTH_TRUSTED_ORIGINS: undefined,
        BETTER_AUTH_URL: "http://localhost:3000",
        GOOGLE_CLIENT_ID: "google-client-id",
        GOOGLE_CLIENT_SECRET: "google-client-secret",
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
    prepareBootstrapUser: vi.fn(async (user) => user),
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
        mocks.appDB = { select: vi.fn() };
        mocks.getAppDBSpy.mockReset();
        mocks.getAppDBSpy.mockReturnValue(mocks.appDB);
        mocks.drizzleAdapterSpy.mockClear();
        mocks.betterAuthSpy.mockClear();
        mocks.openAPISpy.mockClear();
        mocks.tanstackStartCookiesSpy.mockClear();
    });

    it("passes the Drizzle client to the Better Auth adapter", async () => {
        const dbBinding = { prepare: vi.fn() } as unknown as D1Database;
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
