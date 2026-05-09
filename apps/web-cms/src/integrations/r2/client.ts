import { S3Client } from "@aws-sdk/client-s3";
import { createServerOnlyFn } from "@tanstack/react-start";

import type { R2Config } from "#/integrations/r2/types";

/**
 * Create and return an S3 client configured for Cloudflare R2
 */
export const getR2Client = createServerOnlyFn(
    (config: R2Config) =>
        new S3Client({
            region: "auto",
            endpoint: config.endpoint,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        })
);
