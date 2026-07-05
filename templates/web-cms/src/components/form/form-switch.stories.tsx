import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormSwitch } from "./form-switch";

const meta: Meta<typeof FormSwitch> = {
    title: "Form/FormSwitch",
    component: FormSwitch,
};

export default meta;

type Story = StoryObj<typeof FormSwitch>;

function FormSwitchWrapper({
    defaultValue = false,
    label = "Enable notifications",
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
                {(field) => <FormSwitch field={field} label={label} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormSwitchWrapper />,
};

export const ToggledOn: Story = {
    render: () => <FormSwitchWrapper defaultValue={true} label="Dark mode" />,
};
