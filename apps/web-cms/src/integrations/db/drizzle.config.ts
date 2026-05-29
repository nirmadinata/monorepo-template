import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    driver: "d1-http",
    out: "./src/integrations/db/migrations",
    schema: "../../packages/db-schema/src/index.ts",
});
