import { getDB, schema } from "@repo/db/d1";

export { schema as dbSchema };

export function getAppDB(dbBinding: D1Database) {
    return getDB(dbBinding);
}

export type AppDB = ReturnType<typeof getAppDB>;
