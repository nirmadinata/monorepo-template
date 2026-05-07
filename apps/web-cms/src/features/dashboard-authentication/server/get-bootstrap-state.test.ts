// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { hasExistingUsers } from "#/integrations/auth/index";

const mocks = vi.hoisted(() => ({
    binding: { name: "MAIN_DB" } as unknown as D1Database,
    hasExistingUsers: vi.fn<typeof hasExistingUsers>(),
}));

vi.mock(import("#/integrations/appenv/worker"), () => ({
    getMainDBBinding: () => mocks.binding,
}));

vi.mock(import("#/integrations/auth/index"), () => ({
    hasExistingUsers: mocks.hasExistingUsers,
}));

describe("readBootstrapState", () => {
    beforeEach(() => {
        mocks.hasExistingUsers.mockReset();
    });

    it("returns an open bootstrap state when no users exist", async () => {
        mocks.hasExistingUsers.mockResolvedValue(false);

        const { readBootstrapState } = await import("./get-bootstrap-state");

        expect(readBootstrapState(false)).toStrictEqual({
            hasUsers: false,
            isBootstrapOpen: true,
        });
    });

    it("returns a closed bootstrap state when users already exist", async () => {
        mocks.hasExistingUsers.mockResolvedValue(true);

        const { readBootstrapState } = await import("./get-bootstrap-state");

        expect(readBootstrapState(true)).toStrictEqual({
            hasUsers: true,
            isBootstrapOpen: false,
        });
    });
});
