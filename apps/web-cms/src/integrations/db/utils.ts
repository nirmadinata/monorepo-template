import { drizzle } from "drizzle-orm/d1";
import type { AnyD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";

function createDB(db: AnyD1Database) {
    return drizzle(db, {
        schema,
    });
}

let db: ReturnType<typeof createDB> | null = null;

export function getDB(d1: AnyD1Database) {
    db ??= createDB(d1);
    return db;
}
