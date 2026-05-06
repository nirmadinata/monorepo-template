import { APIError } from "better-auth/api";

export const BOOTSTRAP_ADMIN_ROLE = "superadmin";

export async function assertFirstUserSignupAllowed(
    checkForExistingUsers: () => Promise<boolean>
) {
    if (await checkForExistingUsers()) {
        throw new APIError("FORBIDDEN", {
            message: "Sign up is closed after the first user.",
        });
    }
}

export async function prepareBootstrapUser<
    TUser extends { role?: string | null },
>(user: TUser, checkForExistingUsers: () => Promise<boolean>) {
    await assertFirstUserSignupAllowed(checkForExistingUsers);

    return {
        ...user,
        role: BOOTSTRAP_ADMIN_ROLE,
    };
}
