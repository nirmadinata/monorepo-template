// oxlint-disable unicorn/prefer-spread
import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

import oxignore from "./oxignore.json" with { type: "json" };

export default defineConfig({
    ...ultracite,
    ignorePatterns: Array.from(oxignore),
    tabWidth: 4,
});
