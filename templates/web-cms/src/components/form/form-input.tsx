"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

/**
 * Wraps an {@link Input} field with a label on top and error message below.
 * Forwards all standard input props except `value`, `onChange`, `onBlur`, and `name` which are managed by TanStack Form.
 *
 * @example
 * ```tsx
 * <form.Field name="email">
 *   {(field) => <FormInput field={field} label="Email" type="email" placeholder="you@example.com" />}
 * </form.Field>
 * ```
 */
export interface FormInputProps extends Omit<
    React.ComponentProps<typeof Input>,
    "value" | "onChange" | "onBlur" | "name"
> {
    field: AnyFieldApi;
    label: ReactNode;
}

export function FormInput({ field, label, className, ...inputProps }: FormInputProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <Input
                    aria-describedby={
                        fieldErrors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined
                    }
                    aria-invalid={fieldErrors.length > 0 || undefined}
                    name={String(field.name)}
                    onBlur={() => field.handleBlur()}
                    value={field.state.value ?? ""}
                    onChange={(event) => field.handleChange(event.currentTarget.value)}
                    {...inputProps}
                />
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
