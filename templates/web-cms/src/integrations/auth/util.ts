import { createServerOnlyFn } from "@tanstack/react-start";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

import { schema } from "../db";
import { getDB } from "../db/clients";
import { BOOTSTRAP_ADMIN_ROLE } from "./constants";

export const authSchema = {
    account: schema.accounts,
    session: schema.sessions,
    user: schema.users,
    verification: schema.verification,
};

export function parseTrustedOrigins(value?: string) {
    if (!value) {
        return;
    }

    const origins = value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return origins.length > 0 ? origins : undefined;
}

export async function assertFirstUserSignupAllowed(checkForExistingUsers: () => Promise<boolean>) {
    if (await checkForExistingUsers()) {
        throw new APIError("FORBIDDEN", {
            message: "Sign up is closed after the first user.",
        });
    }
}

export async function prepareBootstrapUser<TUser extends object>(
    user: TUser & { role?: string | null },
    checkForExistingUsers: () => Promise<boolean>
) {
    await assertFirstUserSignupAllowed(checkForExistingUsers);

    return {
        ...user,
        role: BOOTSTRAP_ADMIN_ROLE,
    };
}

export const hasExistingUsers = createServerOnlyFn(async (db: D1Database) => {
    const existingUsers = await getDB(db).$count(
        schema.users,
        eq(schema.users.id, schema.users.id)
    );

    return existingUsers > 0;
});
