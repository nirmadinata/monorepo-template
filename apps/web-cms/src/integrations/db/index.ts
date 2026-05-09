import * as schema from "./schema";
import { getDB } from "./utils";

export { schema as dbSchema };
export * from "./constants";
export * from "./utils";

export function getAppDB(dbBinding: D1Database) {
    return getDB(dbBinding);
}

export type AppDB = ReturnType<typeof getAppDB>;
