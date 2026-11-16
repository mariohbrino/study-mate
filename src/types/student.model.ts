import type { students } from "@/database/schemas/students.schema";

export type Student = typeof students.$inferSelect;

export type CreateStudentInput = typeof students.$inferInsert;

export type UpdateStudentInput = Partial<Pick<Student, "timezone">>;
