import type { assignments } from "@/database/schema";

export type AssignmentStatus = "pending" | "in_progress" | "completed";

export type Assignment = typeof assignments.$inferSelect;

export type StoreAssignmentInput = typeof assignments.$inferInsert;

export type UpdateAssignmentInput = Partial<
  Pick<
    Assignment,
    "studentId" | "title" | "description" | "course" | "dueAt" | "status"
  >
>;
