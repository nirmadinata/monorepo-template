import type { Meta, StoryObj } from "@storybook/tanstack-react";

import { PlateEditor } from "#/components/editor/plate-editor.tsx";

import { TooltipProvider } from "../ui/tooltip";

const meta: Meta<typeof PlateEditor> = {
    title: "Editor/PlateEditor",
    component: PlateEditor,
};

export default meta;

type Story = StoryObj<typeof PlateEditor>;

export const Default: Story = {
    render: () => (
        <TooltipProvider>
            <PlateEditor />
        </TooltipProvider>
    ),
};
