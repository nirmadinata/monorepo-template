// @vitest-environment node

import type * as DBModule from "@repo/db/d1";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    binding: { name: "MAIN_DB" } as unknown as D1Database,
    getDBSpy: vi.fn<() => { kind: string }>(() => ({ kind: "db" })),
    schema: {
        users: { id: "users.id" },
    } as unknown as typeof DBModule.schema,
}));

vi.mock(import('#/integrations/appenv/worker'), () => ({
    getMainDBBinding: () => mocks.binding,
}));

vi.mock(import('@repo/db/d1'), () => ({
    getDB: mocks.getDBSpy as unknown as typeof DBModule.getDB,
    schema: mocks.schema,
}));

describe("getAppDB", () => {
    beforeEach(() => {
        mocks.getDBSpy.mockClear();
        mocks.getDBSpy.mockReturnValue({ kind: "db" });
    });

    it("uses the shared MAIN_DB binding and schema", async () => {
        const { dbSchema, getAppDB } = await import("./index");

        expect(getAppDB()).toStrictEqual({ kind: "db" });
        expect(mocks.getDBSpy).toHaveBeenCalledWith(mocks.binding);
        expect(dbSchema).toBe(mocks.schema);
    });
});
