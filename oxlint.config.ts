// oxlint-disable unicorn/prefer-spread
import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";
import remix from "ultracite/oxlint/remix";
import vitest from "ultracite/oxlint/vitest";

import oxignore from "./oxignore.json" with { type: "json" };

export default defineConfig({
    extends: [core, react, next, remix, vitest],
    ignorePatterns: Array.from(oxignore),
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
        "require-await": "off",
        "no-abusive-eslint-disable": "off",
        "no-empty-interface": "off",
        "no-empty-object": "off",
    },
});
