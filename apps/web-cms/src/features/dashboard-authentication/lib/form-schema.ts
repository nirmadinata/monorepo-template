import { z } from "zod";

export const googleAuthSubmissionSchema = z.object({
    intent: z.enum(["sign-in", "sign-up"]),
});

export type GoogleAuthSubmission = z.infer<typeof googleAuthSubmissionSchema>;
