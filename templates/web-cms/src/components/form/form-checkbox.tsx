"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

/**
 * A single boolean checkbox with a label on top and error message below.
 * The field's value must be `boolean` (typically `defaultValue: false` in `useForm`).
 *
 * @example
 * ```tsx
 * <form.Field name="acceptTerms">
 *   {(field) => <FormCheckbox field={field} label="I accept the terms" />}
 * </form.Field>
 * ```
 */
export interface FormCheckboxProps {
    field: AnyFieldApi;
    label: ReactNode;
    className?: string;
}

export function FormCheckbox({ field, label, className }: FormCheckboxProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <Checkbox
                    aria-describedby={
                        fieldErrors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined
                    }
                    aria-invalid={fieldErrors.length > 0 || undefined}
                    checked={field.state.value === true}
                    name={String(field.name)}
                    onBlur={() => field.handleBlur()}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                />
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
