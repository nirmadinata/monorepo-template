import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

function createDB(db: D1Database) {
    return drizzle(db, {
        schema,
    });
}

let db: ReturnType<typeof createDB> | null = null;

export function getDB(d1: D1Database) {
    db ??= createDB(d1);
    return db;
}
