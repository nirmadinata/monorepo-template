import * as schema from "@repo/db-schema";

import type { getDB } from "./utils";

export { schema as dbSchema };
export * from "./utils";

export type AppDB = ReturnType<typeof getDB>;
