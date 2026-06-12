import { createServerOnlyFn } from "@tanstack/react-start";

import { SEEDED_MEDIA_MIME_TYPES } from "#/features/dashboard-media-library/lib/constants";
import { dbSchema, getDB } from "#/integrations/db";

export const seedAppForFirstUserSignup = createServerOnlyFn(
    async ({ db, userId }: { db: D1Database; userId: string }) => {
        const database = getDB(db);

        await database
            .insert(dbSchema.mimeTypes)
            .values(
                SEEDED_MEDIA_MIME_TYPES.map((mimeType) => ({
                    createdBy: userId,
                    description: null,
                    kind: mimeType.kind,
                    mimeType: mimeType.mimeType,
                    title: mimeType.title,
                    updatedBy: userId,
                }))
            )
            .onConflictDoNothing();
    }
);
