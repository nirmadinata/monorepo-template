"use client";

import { createPlatePlugin } from "platejs/react";

import { FloatingToolbarButtons } from "#/components/ui/floating-toolbar-buttons.tsx";
import { FloatingToolbar } from "#/components/ui/floating-toolbar.tsx";

export const FloatingToolbarKit = [
    createPlatePlugin({
        key: "floating-toolbar",
        render: {
            afterEditable: () => (
                <FloatingToolbar>
                    <FloatingToolbarButtons />
                </FloatingToolbar>
            ),
        },
    }),
];
