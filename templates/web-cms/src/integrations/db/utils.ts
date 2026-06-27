import * as schema from "@repo/db-schema";
import { drizzle } from "drizzle-orm/d1";

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
