import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormRadioGroup } from "./form-radio-group";

const meta: Meta<typeof FormRadioGroup> = {
    title: "Form/FormRadioGroup",
    component: FormRadioGroup,
};

export default meta;

type Story = StoryObj<typeof FormRadioGroup>;

const defaultOptions = [
    { value: "admin", label: "Administrator" },
    { value: "user", label: "Regular user" },
];

function FormRadioGroupWrapper({
    defaultValue = "",
    label = "Role",
    options = defaultOptions,
}: {
    defaultValue?: string;
    label?: string;
    options?: { value: string; label: string }[];
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
                {(field) => <FormRadioGroup field={field} label={label} options={options} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormRadioGroupWrapper />,
};

export const PreSelected: Story = {
    render: () => <FormRadioGroupWrapper defaultValue="user" label="Account type" />,
};
