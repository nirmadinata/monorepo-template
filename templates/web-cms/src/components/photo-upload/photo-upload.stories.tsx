import type { Meta, StoryObj } from "@storybook/tanstack-react";

import { PhotoUpload } from "./photo-upload";

const meta: Meta<typeof PhotoUpload> = {
    title: "PhotoUpload",
    component: PhotoUpload,
};

export default meta;

type Story = StoryObj<typeof PhotoUpload>;

export const CircleDefault: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload shape="circle" />
        </div>
    ),
};

export const CircleWithInitialSrc: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload
                shape="circle"
                initialSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
            />
        </div>
    ),
};

export const CircleWithDefaultSrc: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload
                shape="circle"
                defaultSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
            />
        </div>
    ),
};

export const CircleWithInitialAndDefault: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload
                shape="circle"
                initialSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                defaultSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
            />
        </div>
    ),
};

export const CircleCustomPlaceholder: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload
                shape="circle"
                placeholder={<span className="text-xl font-bold text-muted-foreground">+</span>}
            />
        </div>
    ),
};

export const SquareDefault: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload shape="square" />
        </div>
    ),
};

export const SquareWithInitialSrc: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload
                shape="square"
                initialSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop"
            />
        </div>
    ),
};

export const RectangleDefault: Story = {
    render: () => (
        <div className="w-80">
            <PhotoUpload shape="rectangle" />
        </div>
    ),
};

export const RectangleWithInitialSrc: Story = {
    render: () => (
        <div className="w-80">
            <PhotoUpload
                shape="rectangle"
                initialSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=450&fit=crop"
            />
        </div>
    ),
};

export const CustomClassName: Story = {
    render: () => (
        <div className="w-40">
            <PhotoUpload shape="circle" className="border-primary shadow-lg" />
        </div>
    ),
};
