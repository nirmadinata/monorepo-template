import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

import oxignore from "./oxignore";

export default defineConfig({
    ...ultracite,
    ignorePatterns: oxignore,
    tabWidth: 4,
});
