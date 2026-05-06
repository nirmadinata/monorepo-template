// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
    BOOTSTRAP_ADMIN_ROLE,
    assertFirstUserSignupAllowed,
    prepareBootstrapUser,
} from "./utils";

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

describe(prepareBootstrapUser, () => {
    it("assigns the superadmin role to the bootstrap user", async () => {
        await expect(
            prepareBootstrapUser(
                {
                    email: "owner@example.com",
                    name: "Owner",
                },
                async () => false
            )
        ).resolves.toStrictEqual({
            email: "owner@example.com",
            name: "Owner",
            role: BOOTSTRAP_ADMIN_ROLE,
        });
    });
});
