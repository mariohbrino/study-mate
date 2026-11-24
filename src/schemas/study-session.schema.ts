import { z } from "zod";

const optionalAssignmentId = z.preprocess(
  (value: unknown) => (value === "" ? null : value),
  z.uuid().nullable().optional(),
);

export const studySessionSearchParamsSchema = z.object({
  id: z.uuid(),
  studentId: z.uuid(),
});

export const studySessionListParamsSchema = z.object({
  studentId: z.uuid(),
});

export const studySessionFormSchema = z.object({
  studentId: z.uuid(),
  assignmentId: optionalAssignmentId,
  title: z.string().trim().min(1, "Title is required.").max(200),
  subject: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => value || null),
  scheduledAt: z
    .string()
    .trim()
    .min(1, "Scheduled date is required.")
    .pipe(z.coerce.date()),
  durationMinutes: z
    .string()
    .trim()
    .regex(/^[1-9]\d{0,2}$/, "Duration must be between 1 and 999 minutes."),
});

export const studySessionUpdateFormSchema = studySessionFormSchema
  .omit({ studentId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export type StudySessionFormInput = z.infer<typeof studySessionFormSchema>;
export type StudySessionUpdateFormInput = z.infer<
  typeof studySessionUpdateFormSchema
>;
