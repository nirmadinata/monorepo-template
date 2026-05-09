import * as schema from "./schema";
import { getDB } from "./utils";

export { schema as dbSchema };
export * from "./constants";
export * from "./utils";

export const getAppDB = getDB;

export type AppDB = ReturnType<typeof getAppDB>;
