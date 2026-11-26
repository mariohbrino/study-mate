import { z } from "zod";

export const assignmentStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
]);

export const assignmentFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().min(1, "Description is required"),
  course: z.string().trim().min(1, "Course is required").max(255),
  dueAt: z.coerce.date({
    error: "A valid due date is required",
  }),
  status: assignmentStatusSchema,
});

export const assignmentUpdateFormSchema = assignmentFormSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for an update.",
  });

export const assignmentSearchParamsSchema = z.object({
  id: z.uuid(),
});
