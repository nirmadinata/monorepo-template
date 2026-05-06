import { getDB, schema } from "@repo/db/d1";

import { getMainDBBinding } from "#/integrations/appenv/worker";

export { schema as dbSchema };

export function getAppDB(dbBinding: D1Database = getMainDBBinding()) {
    return getDB(dbBinding);
}

export type AppDB = ReturnType<typeof getAppDB>;
