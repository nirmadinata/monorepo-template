// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    apiGetSession: vi.fn(),
    env: {
        MAIN_DB: { name: "MAIN_DB" } as unknown as D1Database,
        MAIN_KV: {
            delete: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
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
        };

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
