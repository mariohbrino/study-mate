import { eq } from "drizzle-orm";

import { students } from "@/database/schema";
import type { Database } from "@/types/database.type";
import type {
  StoreStudentInput,
  UpdateStudentInput,
} from "@/types/student.type";

export const createStudentModel = (db: Database) => {
  return {
    async get() {
      const studentList = await db.select().from(students);
      return studentList;
    },

    async store(data: StoreStudentInput) {
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

    async remove(id: string) {
      const [student] = await db
        .delete(students)
        .where(eq(students.id, id))
        .returning();

      return student ?? null;
    },
  };
};
