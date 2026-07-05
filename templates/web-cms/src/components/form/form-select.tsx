"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

interface SelectOption {
    value: string;
    label: ReactNode;
}

/**
 * A dropdown select for picking a single string value.
 * The field's value must be a `string` (typically `defaultValue: ""` in `useForm`).
 *
 * @example
 * ```tsx
 * <form.Field name="country">
 *   {(field) => (
 *     <FormSelect
 *       field={field}
 *       label="Country"
 *       placeholder="Select a country"
 *       options={[
 *         { value: "us", label: "United States" },
 *         { value: "id", label: "Indonesia" },
 *       ]}
 *     />
 *   )}
 * </form.Field>
 * ```
 */
export interface FormSelectProps {
    field: AnyFieldApi;
    label: ReactNode;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
}

export function FormSelect({ field, label, options, placeholder, className }: FormSelectProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);

    return (
        <Field className={className}>
            <FieldTitle>{label}</FieldTitle>
            <FieldContent>
                <Select
                    items={options}
                    value={field.state.value ?? ""}
                    onValueChange={(value) => field.handleChange(value)}
                >
                    <SelectTrigger
                        aria-describedby={
                            fieldErrors.length > 0
                                ? getFormFieldErrorId(String(field.name))
                                : undefined
                        }
                        aria-invalid={fieldErrors.length > 0 || undefined}
                        className="w-full"
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
