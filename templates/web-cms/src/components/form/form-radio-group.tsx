"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

interface RadioOption {
    value: string;
    label: ReactNode;
}

/**
 * A group of radio buttons for picking a single string value.
 * The field's value must be a `string` (typically `defaultValue: ""` in `useForm`).
 *
 * @example
 * ```tsx
 * <form.Field name="role">
 *   {(field) => (
 *     <FormRadioGroup
 *       field={field}
 *       label="Role"
 *       options={[
 *         { value: "admin", label: "Administrator" },
 *         { value: "user", label: "Regular user" },
 *       ]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export interface FormRadioGroupProps {
    field: AnyFieldApi;
    label: ReactNode;
    options: RadioOption[];
    className?: string;
}

export function FormRadioGroup({ field, label, options, className }: FormRadioGroupProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <RadioGroup
                    aria-describedby={
                        fieldErrors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined
                    }
                    aria-invalid={fieldErrors.length > 0 || undefined}
                    name={String(field.name)}
                    value={field.state.value ?? ""}
                    onValueChange={(value) => field.handleChange(value)}
                >
                    {options.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                            <RadioGroupItem value={option.value} />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
                </RadioGroup>
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
