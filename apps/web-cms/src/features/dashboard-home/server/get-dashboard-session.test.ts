// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { getCurrentSession } from "#/integrations/auth";

const getCurrentSessionMock = vi.fn<typeof getCurrentSession>();

vi.mock(import("#/integrations/auth/server"), () => ({
    getCurrentSession: getCurrentSessionMock,
}));

describe("getDashboardSession", () => {
    beforeEach(() => {
        getCurrentSessionMock.mockReset();
    });

    it("returns the current session when the user is authenticated", async () => {
        const expectedSession: Awaited<ReturnType<typeof getCurrentSession>> = {
            session: { id: "session-1" },
            user: { email: "editor@example.com" },
        };

        getCurrentSessionMock.mockResolvedValue(expectedSession);

        const { getDashboardSession } = await import("./get-dashboard-session");

        await expect(getDashboardSession()).resolves.toStrictEqual(
            expectedSession
        );
    });

    it("redirects to login when no session is available", async () => {
        getCurrentSessionMock.mockResolvedValue(null);

        const { getDashboardSession } = await import("./get-dashboard-session");

        await expect(getDashboardSession()).rejects.toMatchObject({
            status: 307,
            options: { to: "/login" },
        });
    });
});
