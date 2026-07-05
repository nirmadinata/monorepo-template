import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormInput } from "./form-input";

const meta: Meta<typeof FormInput> = {
    title: "Form/FormInput",
    component: FormInput,
};

export default meta;

type Story = StoryObj<typeof FormInput>;

function FormInputWrapper({
    defaultValue = "",
    label = "Email",
    type,
    placeholder,
}: {
    defaultValue?: string;
    label?: string;
    type?: string;
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
                    <FormInput field={field} label={label} placeholder={placeholder} type={type} />
                )}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormInputWrapper />,
};

export const Email: Story = {
    render: () => <FormInputWrapper label="Email" type="email" placeholder="you@example.com" />,
};

export const Password: Story = {
    render: () => (
        <FormInputWrapper label="Password" type="password" placeholder="Enter password" />
    ),
};
