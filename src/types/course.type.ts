import type { courses } from "@/database/schemas/courses.schema";

export type Course = typeof courses.$inferSelect;

export type CourseField = "name" | "studentId";

export type CourseState = {
  values?: Partial<Record<CourseField, string>>;
  message?: string;
  errors?: Partial<Record<CourseField, string[]>>;
};

export type RemoveState = { error?: string };
