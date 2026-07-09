"use client";

import { createPlatePlugin } from "platejs/react";

import { FixedToolbarButtons } from "#/components/ui/fixed-toolbar-buttons.tsx";
import { FixedToolbar } from "#/components/ui/fixed-toolbar.tsx";

export const FixedToolbarKit = [
    createPlatePlugin({
        key: "fixed-toolbar",
        render: {
            beforeEditable: () => (
                <FixedToolbar>
                    <FixedToolbarButtons />
                </FixedToolbar>
            ),
        },
    }),
];
