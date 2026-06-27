// oxlint-disable typescript/no-explicit-any
import type { AppDB } from "#/integrations/db";

export type IRepository = Record<string, (db: AppDB, ...args: any[]) => any>;
