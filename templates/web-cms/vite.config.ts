import path from "node:path";

/// <reference types="vitest/config" />
import { cloudflare } from "@cloudflare/vite-plugin";
import babel from "@rolldown/plugin-babel";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

const { dirname } = import.meta;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const config = defineConfig((_) => {
    // as
    const isStorybook = process.argv.some((arg) => arg.includes("storybook"));

    return {
        plugins: [
            devtools(),
            !isStorybook &&
                cloudflare({
                    viteEnvironment: {
                        name: "ssr",
                    },
                    persistState: {
                        path: "../../.wrangler/state",
                    },
                }),
            tailwindcss(),
            tanstackStart(),
            react(),
            babel({
                presets: [reactCompilerPreset()],
            }),
        ].filter((plugin) => !!plugin),
        resolve: {
            conditions: ["browser", "module", "import", "development"],
            dedupe: ["react", "react-dom"],
            tsconfigPaths: true,
        },
        test: {
            projects: [
                {
                    extends: true,
                    plugins: [
                        // The plugin will run tests for the stories defined in your Storybook config
                        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                        storybookTest({
                            configDir: path.join(dirname, ".storybook"),
                        }),
                    ],
                    test: {
                        name: "storybook",
                        browser: {
                            enabled: true,
                            headless: true,
                            provider: playwright({}),
                            instances: [
                                {
                                    browser: "chromium",
                                },
                            ],
                        },
                    },
                },
            ],
        },
    };
});
export default config;
