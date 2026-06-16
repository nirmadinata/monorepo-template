// oxlint-disable unicorn/prefer-spread
import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import remix from "ultracite/oxlint/remix";

import oxignore from "./oxignore.json" with { type: "json" };

export default defineConfig({
    extends: [core, react, next, remix],
    jsPlugins: ["oxlint-tailwindcss"],
    ignorePatterns: Array.from(oxignore),
    overrides: [
        {
            files: ["apps/web-cms/**/*.{ts,tsx}"],
            rules: {
                "no-head-element": "off",
                "no-img-element": "off",
                "react/react-compiler": "error",
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
});
