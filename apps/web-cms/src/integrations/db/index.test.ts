// @vitest-environment node

import { beforeEach, describe, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    binding: { name: "MAIN_DB" } as unknown as D1Database,
    getDBSpy: vi.fn<() => { kind: string }>(() => ({ kind: "db" })),
    schema: {
        accounts: { id: "accounts.id" },
        sessions: { id: "sessions.id" },
        users: { id: "users.id" },
        verification: { id: "verification.id" },
    },
}));

vi.mock(import("#/integrations/appenv/worker"), () => ({
    getMainDBBinding: () => mocks.binding,
}));

vi.mock(import("./utils"), () => ({
    getDB: mocks.getDBSpy,
}));

vi.mock(import("./schema"), () => ({
    ...mocks.schema,
}));

describe("getAppDB", () => {
    beforeEach(() => {
        mocks.getDBSpy.mockClear();
        mocks.getDBSpy.mockReturnValue({ kind: "db" });
    });
});
