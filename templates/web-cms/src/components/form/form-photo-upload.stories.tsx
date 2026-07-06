import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useForm } from "@tanstack/react-form";

import { FormPhotoUpload } from "./form-photo-upload";

const meta: Meta<typeof FormPhotoUpload> = {
    title: "Form/FormPhotoUpload",
    component: FormPhotoUpload,
};

export default meta;

type Story = StoryObj<typeof FormPhotoUpload>;

function FormPhotoUploadWrapper({
    defaultValue = null,
    label = "Photo",
    shape,
    initialSrc,
    isNeedConfirmation,
}: {
    defaultValue?: File | null;
    label?: string;
    shape?: "circle" | "square" | "rectangle";
    initialSrc?: string | null;
    isNeedConfirmation?: boolean | "on-replace";
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
                    <FormPhotoUpload
                        field={field}
                        label={label}
                        shape={shape}
                        initialSrc={initialSrc}
                        isNeedConfirmation={isNeedConfirmation}
                        className="w-40"
                    />
                )}
            </form.Field>
        </form>
    );
}

export const Default: Story = {
    render: () => <FormPhotoUploadWrapper />,
};

export const Avatar: Story = {
    render: () => <FormPhotoUploadWrapper label="Avatar" shape="circle" />,
};

export const Square: Story = {
    render: () => <FormPhotoUploadWrapper label="Thumbnail" shape="square" />,
};

export const Rectangle: Story = {
    render: () => <FormPhotoUploadWrapper label="Cover image" shape="rectangle" />,
};

export const WithInitialSrc: Story = {
    render: () => (
        <FormPhotoUploadWrapper
            label="Profile picture"
            shape="circle"
            initialSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        />
    ),
};

export const ConfirmAlways: Story = {
    render: () => (
        <FormPhotoUploadWrapper label="Avatar" shape="circle" isNeedConfirmation />
    ),
};

export const ConfirmOnReplaceWithInitial: Story = {
    render: () => (
        <FormPhotoUploadWrapper
            label="Profile picture"
            shape="circle"
            initialSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
            isNeedConfirmation="on-replace"
        />
    ),
};

export const ConfirmOnReplaceNoInitial: Story = {
    render: () => (
        <FormPhotoUploadWrapper
            label="New photo"
            shape="square"
            isNeedConfirmation="on-replace"
        />
    ),
};
