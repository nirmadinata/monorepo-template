import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import type { UploadedFileEntry } from "#/integrations/uppy/util";

import { FormFileUpload } from "./form-file-upload";

const meta: Meta<typeof FormFileUpload> = {
    title: "Form/FormFileUpload",
    component: FormFileUpload,
};

export default meta;

type Story = StoryObj<typeof FormFileUpload>;

const EMPTY_FILES: UploadedFileEntry[] = [];

function FormFileUploadWrapper({
    defaultValue = EMPTY_FILES,
    label = "Upload files",
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
                {(field) => <FormFileUpload field={field} label={label} />}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormFileUploadWrapper />,
};

export const CustomLabel: Story = {
    render: () => <FormFileUploadWrapper label="Attachments" />,
};

export const WithExistingFiles: Story = {
    render: () => (
        <FormFileUploadWrapper
            label="Documents"
            defaultValue={[
                {
                    key: "uploads/doc-1.pdf",
                    name: "document-one.pdf",
                    size: 102_400,
                    type: "application/pdf",
                    url: "#",
                },
                {
                    key: "uploads/img-1.png",
                    name: "screenshot.png",
                    size: 204_800,
                    type: "image/png",
                    url: "#",
                },
            ]}
        />
    ),
};
