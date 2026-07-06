import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import type { UploadedFileEntry } from "#/integrations/uppy/util";

import { FormFileUploadPhotoSingle } from "./form-file-upload-photo-single";

const meta: Meta<typeof FormFileUploadPhotoSingle> = {
    title: "Form/FormFileUploadPhotoSingle",
    component: FormFileUploadPhotoSingle,
};

export default meta;

type Story = StoryObj<typeof FormFileUploadPhotoSingle>;

function FormFileUploadPhotoSingleWrapper({
    defaultValue = null,
    label = "Photo",
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
                {(field) => <FormFileUploadPhotoSingle field={field} label={label} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormFileUploadPhotoSingleWrapper />,
};

export const Avatar: Story = {
    render: () => <FormFileUploadPhotoSingleWrapper label="Avatar" />,
};

export const WithExistingPhoto: Story = {
    render: () => (
        <FormFileUploadPhotoSingleWrapper
            label="Profile picture"
            defaultValue={{
                key: "uploads/avatar.jpg",
                name: "john-avatar.jpg",
                size: 128_000,
                type: "image/jpeg",
                url: "#",
            }}
        />
    ),
};
