import { z } from "zod";

export const studentSearchParamsSchema = z.object({
  id: z.uuid(),
});

export const studentFormSchema = z.object({
  clerkId: z.string().trim().min(1, "Clerk ID is required.").max(255),
  timezone: z.string().trim().min(1, "Timezone is required.").max(255),
});

export const studentUpdateFormSchema = z.object({
  timezone: z.string().trim().min(1, "Timezone is required.").max(255),
});

export type StudentFormInput = z.infer<typeof studentFormSchema>;
export type StudentUpdateFormInput = z.infer<typeof studentUpdateFormSchema>;
