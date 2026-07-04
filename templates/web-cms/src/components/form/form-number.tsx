"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

/**
 * A numeric input with optional min, max, and step.
 * The field's value must be a `number` (typically `defaultValue: 0` in `useForm`).
 *
 * @example
 * ```tsx
 * <form.Field name="quantity">
 *   {(field) => <FormNumber field={field} label="Quantity" min={1} max={99} step={1} />}
 * </form.Field>
 * ```
 */
export interface FormNumberProps {
    field: AnyFieldApi;
    label: ReactNode;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    className?: string;
}

export function FormNumber({
    field,
    label,
    min,
    max,
    step,
    placeholder,
    className,
}: FormNumberProps) {
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
                    max={max}
                    min={min}
                    name={String(field.name)}
                    placeholder={placeholder}
                    step={step}
                    type="number"
                    value={field.state.value ?? ""}
                    onBlur={() => field.handleBlur()}
                    onChange={(event) => {
                        const raw = event.currentTarget.value;
                        field.handleChange(raw === "" ? undefined : Number(raw));
                    }}
                />
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
