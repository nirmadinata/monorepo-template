import { cloudflare } from "@cloudflare/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
    plugins: [
        devtools(),
        cloudflare({
            viteEnvironment: { name: "ssr" },
            persistState: { path: "../../.wrangler/state" },
        }),
        tailwindcss(),
        tanstackStart(),
        react(),
        babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: {
        conditions: ["browser", "module", "import", "development"],
        dedupe: ["react", "react-dom"],
        tsconfigPaths: true,
    },
});

export default config;
