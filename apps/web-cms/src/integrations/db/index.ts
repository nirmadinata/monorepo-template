import * as schema from "./schema";
import type { getDB } from "./utils";

export { schema as dbSchema };
export * from "./constants";
export * from "./utils";

export type AppDB = ReturnType<typeof getDB>;
