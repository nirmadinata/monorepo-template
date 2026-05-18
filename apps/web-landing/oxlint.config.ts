// oxlint-disable unicorn/prefer-spread
import { defineConfig } from "oxlint";

export default defineConfig({
    jsPlugins: ["oxlint-tailwindcss"],
    rules: {
        "tailwindcss/enforce-canonical": "error",
    },
});
