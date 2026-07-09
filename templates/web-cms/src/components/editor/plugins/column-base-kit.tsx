import { BaseColumnItemPlugin, BaseColumnPlugin } from "@platejs/layout";

import {
    ColumnElementStatic,
    ColumnGroupElementStatic,
} from "#/components/ui/column-node-static.tsx";

export const BaseColumnKit = [
    BaseColumnPlugin.withComponent(ColumnGroupElementStatic),
    BaseColumnItemPlugin.withComponent(ColumnElementStatic),
];
