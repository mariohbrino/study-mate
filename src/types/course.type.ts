import type { courses } from "@/database/schemas/courses.schema";

export type Course = typeof courses.$inferSelect;

export type StoreCourseInput = typeof courses.$inferInsert;

export type UpdateCourseInput = Partial<Pick<Course, "name">>;
