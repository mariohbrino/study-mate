import { eq, getTableColumns } from "drizzle-orm";

import * as tables from "@/database/schema";
import type {
  StoreAssignmentInput,
  UpdateAssignmentInput,
} from "@/types/assignment.type";
import type { Database } from "@/types/database.type";

export const createAssignmentModel = (db: Database) => {
  const get = async () => {
    const assignmentList = await db.select().from(tables.assignments);

    return assignmentList;
  };

  const store = async (data: StoreAssignmentInput) => {
    const [assignment] = await db
      .insert(tables.assignments)
      .values(data)
      .returning({
        ...getTableColumns(tables.assignments),
      });

    return assignment;
  };

  const findByStudentId = async (studentId: string) => {
    const [assignment] = await db
      .select()
      .from(tables.assignments)
      .where(eq(tables.assignments.studentId, studentId));

    return assignment ? assignment : null;
  };

  const findById = async (id: string) => {
    const [assignment] = await db
      .select()
      .from(tables.assignments)
      .where(eq(tables.assignments.id, id));

    return assignment ? assignment : null;
  };

  const update = async (id: string, data: UpdateAssignmentInput) => {
    const [assignment] = await db
      .update(tables.assignments)
      .set(data)
      .where(eq(tables.assignments.id, id))
      .returning({
        ...getTableColumns(tables.assignments),
      });

    return assignment ? assignment : null;
  };

  const remove = async (id: string) => {
    const [assignment] = await db
      .delete(tables.assignments)
      .where(eq(tables.assignments.id, id))
      .returning({
        ...getTableColumns(tables.assignments),
      });

    return assignment ? assignment : null;
  };

  return {
    get,
    findById,
    findByStudentId,
    store,
    update,
    remove,
  };
};
