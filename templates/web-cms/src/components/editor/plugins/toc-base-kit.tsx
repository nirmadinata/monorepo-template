import { BaseTocPlugin } from "@platejs/toc";

import { TocElementStatic } from "#/components/ui/toc-node-static.tsx";

export const BaseTocKit = [BaseTocPlugin.withComponent(TocElementStatic)];
