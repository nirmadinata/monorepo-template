import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    driver: "d1-http",
    out: "./src/integrations/db/migrations/d1",
    schema: "./src/integrations/db/schema.ts",
});
