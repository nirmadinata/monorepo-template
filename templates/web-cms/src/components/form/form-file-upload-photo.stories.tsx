import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import type { UploadedFileEntry } from "#/integrations/uppy/util";

import { FormFileUploadPhoto } from "./form-file-upload-photo";

const meta: Meta<typeof FormFileUploadPhoto> = {
    title: "Form/FormFileUploadPhoto",
    component: FormFileUploadPhoto,
};

export default meta;

type Story = StoryObj<typeof FormFileUploadPhoto>;

const EMPTY_FILES: UploadedFileEntry[] = [];

function FormFileUploadPhotoWrapper({
    defaultValue = EMPTY_FILES,
    label = "Photos",
}: {
    defaultValue?: UploadedFileEntry[];
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
                {(field) => <FormFileUploadPhoto field={field} label={label} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormFileUploadPhotoWrapper />,
};

export const GalleryUpload: Story = {
    render: () => <FormFileUploadPhotoWrapper label="Gallery images" />,
};

export const WithExistingPhotos: Story = {
    render: () => (
        <FormFileUploadPhotoWrapper
            label="Product photos"
            defaultValue={[
                {
                    key: "uploads/photo-1.jpg",
                    name: "front-view.jpg",
                    size: 256_000,
                    type: "image/jpeg",
                    url: "#",
                },
                {
                    key: "uploads/photo-2.png",
                    name: "angled-view.png",
                    size: 312_000,
                    type: "image/png",
                    url: "#",
                },
            ]}
        />
    ),
};
