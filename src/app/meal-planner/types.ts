import { z } from "zod";

export const participantSchema = z.object({
  name: z.string(),
  calories: z.number(),
  weight: z.number(),
  sex: z.enum(["male", "female"]),
});
export type Participant = z.infer<typeof participantSchema>;

export const storageSchema = z.object({
  participants: z
    .array(participantSchema)
    .min(1, "At least one participant is required"),
  userLikes: z.array(z.string()).default([]),
  userDislikes: z.array(z.string()).default([]),
  useRestrictions: z.array(z.string()).default([]),
  budgetAmount: z.number().positive("Budget amount must be a positive number"),
  budgetPeriod: z.string().nonempty("Budget period is required"),
});

export type Period = "daily" | "weekly" | "biweekly" | "monthly" | "bimonthly";
