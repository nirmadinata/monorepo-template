"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { Switch } from "#/components/ui/switch";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

/**
 * A boolean toggle switch with a label on top and error message below.
 * The field's value must be `boolean` (typically `defaultValue: false` in `useForm`).
 *
 * @example
 * ```tsx
 * <form.Field name="notifications">
 *   {(field) => <FormSwitch field={field} label="Enable notifications" />}
 * </form.Field>
 * ```
 */
export interface FormSwitchProps {
    field: AnyFieldApi;
    label: ReactNode;
    className?: string;
}

export function FormSwitch({ field, label, className }: FormSwitchProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <Switch
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
