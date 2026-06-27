export function toToastErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        const trimmed = error.trim();

        if (trimmed) {
            return trimmed;
        }
    }

    return fallback;
}
