import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormNumber } from "./form-number";

const meta: Meta<typeof FormNumber> = {
    title: "Form/FormNumber",
    component: FormNumber,
};

export default meta;

type Story = StoryObj<typeof FormNumber>;

function FormNumberWrapper({
    defaultValue,
    label = "Quantity",
    min,
    max,
    step,
    placeholder,
}: {
    defaultValue?: number;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
}) {
    const form = useForm({
        defaultValues: { field: defaultValue },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <form.Field name="field">
                {(field) => (
                    <FormNumber
                        field={field}
                        label={label}
                        min={min}
                        max={max}
                        step={step}
                        placeholder={placeholder}
                    />
                )}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormNumberWrapper />,
};

export const WithConstraints: Story = {
    render: () => (
        <FormNumberWrapper
            defaultValue={5}
            label="Age"
            min={1}
            max={120}
            step={1}
            placeholder="Enter age"
        />
    ),
};
