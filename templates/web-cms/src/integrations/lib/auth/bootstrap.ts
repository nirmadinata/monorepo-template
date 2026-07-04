import { createServerOnlyFn } from "@tanstack/react-start";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

import { getDB } from "#/integrations/clients/db";
import { BOOTSTRAP_ADMIN_ROLE } from "#/integrations/constants/auth";
import { dbSchema } from "#/integrations/db";

export const authSchema = {
    account: dbSchema.accounts,
    session: dbSchema.sessions,
    user: dbSchema.users,
    verification: dbSchema.verification,
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
        dbSchema.users,
        eq(dbSchema.users.id, dbSchema.users.id)
    );

    return existingUsers > 0;
});
