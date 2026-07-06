"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldTitle, FieldContent, FieldError } from "#/components/ui/field";
import { extractFormErrorItems, getFormFieldErrorId } from "#/lib/forms";

export interface FormCheckboxProps {
    field: AnyFieldApi;
    label: ReactNode;
    className?: string;
}

export function FormCheckbox({ field, label, className }: FormCheckboxProps) {
    const fieldErrors = extractFormErrorItems(field.state.meta.errors);

    return (
        <Field className={className}>
            <FieldContent>
                <div className="flex items-center gap-2">
                    <Checkbox
                        aria-describedby={
                            fieldErrors.length > 0
                                ? getFormFieldErrorId(String(field.name))
                                : undefined
                        }
                        aria-invalid={fieldErrors.length > 0 || undefined}
                        checked={field.state.value === true}
                        name={String(field.name)}
                        onBlur={() => field.handleBlur()}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                    <FieldTitle className="mb-0!">{label}</FieldTitle>
                </div>
                <FieldError errors={field.state.meta.errors} />
            </FieldContent>
        </Field>
    );
}
