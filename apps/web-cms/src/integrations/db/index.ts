import { getDB, schema } from "@repo/db/d1";

import { getMainDBBinding } from "#/integrations/appenv/worker";

export { schema as dbSchema };

export function getAppDB() {
    return getDB(getMainDBBinding());
}

export type AppDB = ReturnType<typeof getAppDB>;
