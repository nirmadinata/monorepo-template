import { z } from "zod";

export const bootstrapStateSchema = z.object({
    hasUsers: z.boolean(),
    isBootstrapOpen: z.boolean(),
});

export type BootstrapState = z.infer<typeof bootstrapStateSchema>;

export function createBootstrapState(hasUsers: boolean): BootstrapState {
    return bootstrapStateSchema.parse({
        hasUsers,
        isBootstrapOpen: !hasUsers,
    });
}
