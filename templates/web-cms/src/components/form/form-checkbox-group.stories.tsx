import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormCheckboxGroup } from "./form-checkbox-group";

const meta: Meta<typeof FormCheckboxGroup> = {
    title: "Form/FormCheckboxGroup",
    component: FormCheckboxGroup,
};

export default meta;

type Story = StoryObj<typeof FormCheckboxGroup>;

const defaultOptions = [
    { value: "dev", label: "Development" },
    { value: "design", label: "Design" },
    { value: "writing", label: "Writing" },
];

const DEFAULT_VALUE = [] as string[];

function FormCheckboxGroupWrapper({
    defaultValue = DEFAULT_VALUE,
    label = "Interests",
    options = defaultOptions,
}: {
    defaultValue?: string[];
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
                {(field) => <FormCheckboxGroup field={field} label={label} options={options} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormCheckboxGroupWrapper />,
};

export const PreSelected: Story = {
    render: () => <FormCheckboxGroupWrapper defaultValue={["dev", "design"]} label="Skills" />,
};
