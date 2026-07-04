"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

interface CheckboxOption {
    value: string;
    label: ReactNode;
}

/**
 * A group of checkboxes for selecting multiple string values.
 * The field's value must be `string[]` (typically `defaultValue: []` in `useForm`).
 * Toggling a checkbox adds/removes its value from the array.
 *
 * @example
 * ```tsx
 * <form.Field name="interests">
 *   {(field) => (
 *     <FormCheckboxGroup
 *       field={field}
 *       label="Interests"
 *       options={[
 *         { value: "dev", label: "Development" },
 *         { value: "design", label: "Design" },
 *         { value: "writing", label: "Writing" },
 *       ]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export interface FormCheckboxGroupProps {
    field: AnyFieldApi;
    label: ReactNode;
    options: CheckboxOption[];
    className?: string;
}

export function FormCheckboxGroup({ field, label, options, className }: FormCheckboxGroupProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);
    const selectedValues: string[] = field.state.value ?? [];

    function handleOptionToggle(optionValue: string, checked: boolean) {
        if (checked) {
            field.handleChange([...selectedValues, optionValue]);
        } else {
            field.handleChange(selectedValues.filter((v) => v !== optionValue));
        }
    }

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <fieldset
                    aria-describedby={
                        fieldErrors.length > 0 ? getFormFieldErrorId(String(field.name)) : undefined
                    }
                    aria-invalid={fieldErrors.length > 0 || undefined}
                    className="flex flex-col gap-2 border-none p-0"
                >
                    {options.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                            <Checkbox
                                checked={selectedValues.includes(option.value)}
                                name={`${String(field.name)}.${option.value}`}
                                onBlur={() => field.handleBlur()}
                                onCheckedChange={(checked) =>
                                    handleOptionToggle(option.value, checked)
                                }
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
                </fieldset>
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
