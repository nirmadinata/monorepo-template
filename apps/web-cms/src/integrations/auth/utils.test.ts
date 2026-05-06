// @vitest-environment node

import { describe, expect, it } from "vitest";

import { assertFirstUserSignupAllowed } from "./utils";

describe(assertFirstUserSignupAllowed, () => {
    it("allows bootstrap when no users exist", async () => {
        await expect(
            assertFirstUserSignupAllowed(async () => false)
        ).resolves.toBeUndefined();
    });

    it("rejects signup after the first user exists", async () => {
        await expect(
            assertFirstUserSignupAllowed(async () => true)
        ).rejects.toMatchObject({
            message: "Sign up is closed after the first user.",
        });
    });
});
