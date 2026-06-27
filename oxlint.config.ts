// oxlint-disable unicorn/prefer-spread
import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import remix from "ultracite/oxlint/remix";

import ignorePatterns from "./oxignore.json" with { type: "json" };

export default defineConfig({
    extends: [core, react, next, remix],
    jsPlugins: ["oxlint-tailwindcss"],
    ignorePatterns,
    overrides: [
        {
            files: ["templates/web-cms/**/*.{ts,tsx}"],
            rules: {
                "no-head-element": "off",
                "no-img-element": "off",
                "react/react-compiler": ["error", { reportAllBailouts: false }],
            },
        },
    ],
    rules: {
        "func-style": "off",
        "no-barrel-file": "off",
        "no-use-before-define": "off",
        "sort-keys": "off",
        "require-await": "off",
        "no-abusive-eslint-disable": "off",
        "no-empty-interface": "off",
        "tailwindcss/enforce-canonical": "error",
        "tailwindcss/enforce-sort-order": "error",
    },
    settings: {
        tailwindcss: {
            entryPoint: [
                {
                    files: "templates/web-cms/**",
                    use: "templates/web-cms/src/styles.css",
                },
                {
                    files: "templates/web-landing/**",
                    use: "templates/web-landing/src/app/globals.css",
                },
            ],
        },
    },
});
