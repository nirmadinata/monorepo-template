"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { Textarea } from "#/components/ui/textarea";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

/**
 * A multi-line textarea with a label on top and error message below.
 * Forwards all standard textarea props except `value`, `onChange`, `onBlur`, and `name` which are managed by TanStack Form.
 *
 * @example
 * ```tsx
 * <form.Field name="bio">
 *   {(field) => <FormTextarea field={field} label="Bio" placeholder="Tell us about yourself" rows={4} />}
 * </form.Field>
 * ```
 */
export interface FormTextareaProps extends Omit<
    React.ComponentProps<typeof Textarea>,
    "value" | "onChange" | "onBlur" | "name"
> {
    field: AnyFieldApi;
    label: ReactNode;
}

export function FormTextarea({ field, label, className, ...textareaProps }: FormTextareaProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <Textarea
                    aria-describedby={
                        fieldErrors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined
                    }
                    aria-invalid={fieldErrors.length > 0 || undefined}
                    name={String(field.name)}
                    onBlur={() => field.handleBlur()}
                    value={field.state.value ?? ""}
                    onChange={(event) => field.handleChange(event.currentTarget.value)}
                    {...textareaProps}
                />
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
