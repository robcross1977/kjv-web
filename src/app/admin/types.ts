import { z } from "zod";

export const adminSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
});
export type Admin = z.infer<typeof adminSchema>;
export type NewAdmin = Omit<Admin, "id">;
