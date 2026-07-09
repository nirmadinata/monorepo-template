import { BaseEquationPlugin, BaseInlineEquationPlugin } from "@platejs/math";

import {
    EquationElementStatic,
    InlineEquationElementStatic,
} from "#/components/ui/equation-node-static.tsx";

export const BaseMathKit = [
    BaseInlineEquationPlugin.withComponent(InlineEquationElementStatic),
    BaseEquationPlugin.withComponent(EquationElementStatic),
];
