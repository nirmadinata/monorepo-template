import type { AnyFieldApi } from "@tanstack/react-form";

export interface AppFormErrorItem {
    message: string;
}

type ManagedField<TValue> = Pick<AnyFieldApi, "handleBlur" | "name"> & {
    state: {
        meta: {
            errors: readonly unknown[];
        };
        value: TValue;
    };
};

function collectErrorMessages(error: unknown, messages: string[]) {
    if (!error) {
        return;
    }

    if (typeof error === "string") {
        const trimmed = error.trim();

        if (trimmed) {
            messages.push(trimmed);
        }

        return;
    }

    if (error instanceof Error) {
        const trimmed = error.message.trim();

        if (trimmed) {
            messages.push(trimmed);
        }

        return;
    }

    if (Array.isArray(error)) {
        for (const item of error) {
            collectErrorMessages(item, messages);
        }

        return;
    }

    if (typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
            const trimmed = error.message.trim();

            if (trimmed) {
                messages.push(trimmed);
            }

            return;
        }

        for (const value of Object.values(error)) {
            collectErrorMessages(value, messages);
        }
    }
}

export function extractFormErrorItems(errors?: readonly unknown[]): AppFormErrorItem[] {
    const messages: string[] = [];

    for (const error of errors ?? []) {
        collectErrorMessages(error, messages);
    }

    return [...new Set(messages)].map((message) => ({ message }));
}

export function getFormFieldErrorId(name: string) {
    return `${name.replaceAll(/[^a-zA-Z0-9_-]+/g, "-")}-error`;
}

export function getManagedFieldProps<
    TValue extends number | readonly string[] | string | undefined,
>(field: ManagedField<TValue>) {
    const errors = extractFormErrorItems(field.state.meta.errors);

    return {
        "aria-describedby": errors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined,
        "aria-invalid": errors.length > 0 || undefined,
        name: String(field.name),
        onBlur: field.handleBlur,
        value: field.state.value,
    };
}

export function getSubmissionErrorMessage(error: unknown, fallbackMessage: string) {
    const [message] = extractFormErrorItems([error]);
    return message?.message || fallbackMessage;
}

export function createFormSubmissionError(message: string) {
    return {
        "": [{ message }],
    };
}

export async function runFormSubmission(
    form: {
        handleSubmit: () => Promise<void>;
        setErrorMap: (errorMap: {
            onSubmit?: { fields: Record<string, never>; form: string };
        }) => void;
    },
    fallbackMessage: string
) {
    try {
        await form.handleSubmit();
    } catch (error) {
        form.setErrorMap({
            onSubmit: {
                fields: {},
                form: getSubmissionErrorMessage(error, fallbackMessage),
            },
        });
    }
}

export async function submitForm(
    event: Pick<Event, "preventDefault">,
    form: {
        handleSubmit: () => Promise<void>;
        setErrorMap: (errorMap: {
            onSubmit?: { fields: Record<string, never>; form: string };
        }) => void;
    },
    fallbackMessage: string
) {
    event.preventDefault();
    await runFormSubmission(form, fallbackMessage);
}
