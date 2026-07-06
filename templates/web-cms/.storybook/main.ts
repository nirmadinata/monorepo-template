import path from "node:path";

import type { StorybookConfig } from "@storybook/tanstack-react";

const { dirname } = import.meta;

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-mcp",
    ],
    framework: "@storybook/tanstack-react",
    async viteFinal(viteConfig) {
        const { mergeConfig } = await import("vite");
        return mergeConfig(viteConfig, {
            resolve: {
                alias: {
                    "#/integrations/uppy/clients": path.join(dirname, "mocks/uppy-clients.ts"),
                    "#/integrations/uppy/repository": path.join(
                        dirname,
                        "mocks/uppy-repository.ts"
                    ),
                },
            },
        });
    },
};
export default config;
