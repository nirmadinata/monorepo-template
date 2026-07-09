import { BaseCodeDrawingPlugin } from "@platejs/code-drawing";

import { CodeDrawingElement } from "#/components/ui/code-drawing-node.tsx";

export const BaseCodeDrawingKit = [
    BaseCodeDrawingPlugin.configure({
        node: { component: CodeDrawingElement },
    }),
];
