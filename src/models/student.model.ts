import { eq } from "drizzle-orm";

import { students } from "@/database/schema";
import type { Database } from "@/types/database.type";
import type {
  StoreStudentInput,
  UpdateStudentInput,
} from "@/types/student.model";

export const createStudentModel = (db: Database) => {
  const get = async () => {
    const studentList = await db.select().from(students);
    return studentList;
  };

  const store = async (data: StoreStudentInput) => {
    const [student] = await db.insert(students).values(data).returning();

    return student;
  };

  const findById = async (id: string) => {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, id));

    return student ?? null;
  };

  const findByClerkId = async (clerkId: string) => {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.clerkId, clerkId));

    return student ?? null;
  };

  const update = async (id: string, data: UpdateStudentInput) => {
    const [student] = await db
      .update(students)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(students.id, id))
      .returning();

    return student ?? null;
  };

  const remove = async (id: string) => {
    const [student] = await db
      .delete(students)
      .where(eq(students.id, id))
      .returning();

    return student ?? null;
  };

  return {
    get,
    store,
    findById,
    findByClerkId,
    update,
    remove,
  };
};
