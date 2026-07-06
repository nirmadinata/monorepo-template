import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import type { UploadedFileEntry } from "#/integrations/uppy/util";

import { FormFileUploadSingle } from "./form-file-upload-single";

const meta: Meta<typeof FormFileUploadSingle> = {
    title: "Form/FormFileUploadSingle",
    component: FormFileUploadSingle,
};

export default meta;

type Story = StoryObj<typeof FormFileUploadSingle>;

function FormFileUploadSingleWrapper({
    defaultValue = null,
    label = "Avatar",
}: {
    defaultValue?: UploadedFileEntry | null;
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
                {(field) => <FormFileUploadSingle field={field} label={label} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormFileUploadSingleWrapper />,
};

export const CustomLabel: Story = {
    render: () => <FormFileUploadSingleWrapper label="Profile picture" />,
};

export const WithExistingFile: Story = {
    render: () => (
        <FormFileUploadSingleWrapper
            label="Cover image"
            defaultValue={{
                key: "uploads/cover.jpg",
                name: "sunset-cover.jpg",
                size: 512_000,
                type: "image/jpeg",
                url: "#",
            }}
        />
    ),
};
