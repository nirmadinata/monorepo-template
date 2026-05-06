import { cloudflare } from "@cloudflare/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig(() => {
    const isVitest = process.env.VITEST === "true";

    return {
        plugins: [
            devtools(),
            ...(isVitest
                ? []
                : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
            tailwindcss(),
            tanstackStart(),
            viteReact(),
            babel({ presets: [reactCompilerPreset()] }),
        ],
        resolve: { tsconfigPaths: true },
    };
});

export default config;
