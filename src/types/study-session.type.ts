import type { studySessions } from "@/database/schema";

export type StudySession = typeof studySessions.$inferSelect;

export type StoreStudySessionInput = typeof studySessions.$inferInsert;

export type UpdateStudySessionInput = Partial<
  Pick<
    StudySession,
    "assignmentId" | "title" | "subject" | "scheduledAt" | "durationMinutes"
  >
>;
