// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { readCurrentSession } from "./get-current-session";

type SessionResult = Awaited<ReturnType<typeof readCurrentSession>>;

const mocks = vi.hoisted(() => ({
    apiGetSession:
        vi.fn<(context: { headers: Headers }) => Promise<SessionResult>>(),
    env: {
        MAIN_DB: { name: "MAIN_DB" } as unknown as D1Database,
        MAIN_KV: {
            delete: vi.fn<(key: string) => Promise<void>>(),
            get: vi.fn<(key: string) => Promise<string | null>>(),
            put: vi.fn<
                (
                    key: string,
                    value: string,
                    options?: { expirationTtl: number }
                ) => Promise<void>
            >(),
        },
    },
    headers: new Headers({ cookie: "session=abc" }),
}));

describe("getCurrentSession", () => {
    beforeEach(() => {
        mocks.apiGetSession.mockReset();
    });

    it("requests the current Better Auth session with request headers", async () => {
        const expectedSession = {
            session: { id: "session-1" },
            user: { email: "user@example.com" },
        } as SessionResult;

        mocks.apiGetSession.mockResolvedValue(expectedSession);

        const { readCurrentSession } = await import("./get-current-session");

        await expect(
            readCurrentSession(mocks.headers, {
                env: mocks.env,
                getSession: mocks.apiGetSession,
            })
        ).resolves.toStrictEqual(expectedSession);
        expect(mocks.apiGetSession).toHaveBeenCalledWith({
            headers: mocks.headers,
        });
    });
});
