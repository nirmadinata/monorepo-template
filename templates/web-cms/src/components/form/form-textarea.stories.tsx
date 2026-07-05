import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormTextarea } from "./form-textarea";

const meta: Meta<typeof FormTextarea> = {
    title: "Form/FormTextarea",
    component: FormTextarea,
};

export default meta;

type Story = StoryObj<typeof FormTextarea>;

function FormTextareaWrapper({
    defaultValue = "",
    label = "Bio",
    placeholder,
    rows,
}: {
    defaultValue?: string;
    label?: string;
    placeholder?: string;
    rows?: number;
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
                    <FormTextarea
                        field={field}
                        label={label}
                        placeholder={placeholder}
                        rows={rows}
                    />
                )}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormTextareaWrapper />,
};

export const WithPlaceholder: Story = {
    render: () => (
        <FormTextareaWrapper label="Description" placeholder="Tell us about yourself" rows={4} />
    ),
};
