import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormCheckbox } from "./form-checkbox";

const meta: Meta<typeof FormCheckbox> = {
    title: "Form/FormCheckbox",
    component: FormCheckbox,
};

export default meta;

type Story = StoryObj<typeof FormCheckbox>;

function FormCheckboxWrapper({
    defaultValue = false,
    label = "I accept the terms",
}: {
    defaultValue?: boolean;
    label?: string;
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
                {(field) => <FormCheckbox field={field} label={label} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormCheckboxWrapper />,
};

export const Checked: Story = {
    render: () => <FormCheckboxWrapper defaultValue={true} label="Subscribe to newsletter" />,
};
