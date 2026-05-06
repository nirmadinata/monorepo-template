import { APIError } from "better-auth/api";

export async function assertFirstUserSignupAllowed(
    checkForExistingUsers: () => Promise<boolean>
) {
    if (await checkForExistingUsers()) {
        throw new APIError("FORBIDDEN", {
            message: "Sign up is closed after the first user.",
        });
    }
}
