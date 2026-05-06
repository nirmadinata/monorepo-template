import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    driver: "d1-http",
    out: "./migrations/d1",
    schema: "./src/d1/schema.ts",
});
