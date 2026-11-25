import { z } from "zod";

export const courseIdSchema = z.object({
  id: z.uuid(),
});

export const courseSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(255),
});

export const courseUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(255),
});
