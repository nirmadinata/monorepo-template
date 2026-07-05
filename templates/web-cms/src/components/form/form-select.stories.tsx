import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormSelect } from "./form-select";

const meta: Meta<typeof FormSelect> = {
    title: "Form/FormSelect",
    component: FormSelect,
};

export default meta;

type Story = StoryObj<typeof FormSelect>;

const defaultOptions = [
    { value: "us", label: "United States" },
    { value: "id", label: "Indonesia" },
    { value: "jp", label: "Japan" },
];

function FormSelectWrapper({
    defaultValue = "",
    label = "Country",
    placeholder = "Select a country",
    options = defaultOptions,
}: {
    defaultValue?: string;
    label?: string;
    placeholder?: string;
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
                {(field) => (
                    <FormSelect
                        field={field}
                        label={label}
                        options={options}
                        placeholder={placeholder}
                    />
                )}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormSelectWrapper />,
};

export const PreSelected: Story = {
    render: () => (
        <FormSelectWrapper
            defaultValue="id"
            label="Language"
            placeholder="Select a language"
            options={[
                { value: "en", label: "English" },
                { value: "id", label: "Bahasa Indonesia" },
            ]}
        />
    ),
};
