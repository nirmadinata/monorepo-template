import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import remix from "ultracite/oxlint/remix";
import vitest from "ultracite/oxlint/vitest";

import oxignore from "./oxignore";

export default defineConfig({
    extends: [core, react, next, remix, vitest],
    ignorePatterns: oxignore,
    overrides: [
        {
            files: ["apps/web-cms/**/*.{ts,tsx}"],
            rules: {
                "no-head-element": "off",
                "no-img-element": "off",
            },
        },
    ],
    rules: {
        "func-style": "off",
        "no-barrel-file": "off",
        "no-use-before-define": "off",
        "sort-keys": "off",
    },
});
