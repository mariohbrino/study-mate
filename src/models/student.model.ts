import { eq } from "drizzle-orm";

import { students } from "@/database/schema";
import type { database } from "@/services/database.service";
import type {
  CreateStudentInput,
  UpdateStudentInput,
} from "@/types/student.model";

type Database = ReturnType<typeof database>;

export const createStudentModel = (db: Database) => {
  return {
    async create(data: CreateStudentInput) {
      const [student] = await db.insert(students).values(data).returning();

      return student;
    },

    async findById(id: string) {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.id, id));

      return student ?? null;
    },

    async findByClerkId(clerkId: string) {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.clerkId, clerkId));

      return student ?? null;
    },

    async update(id: string, data: UpdateStudentInput) {
      const [student] = await db
        .update(students)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(students.id, id))
        .returning();

      return student ?? null;
    },

    async delete(id: string) {
      const [student] = await db
        .delete(students)
        .where(eq(students.id, id))
        .returning();

      return student ?? null;
    },
  };
};
