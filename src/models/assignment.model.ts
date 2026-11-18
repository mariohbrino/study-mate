import { eq, getTableColumns } from "drizzle-orm";

import * as tables from "@/database/schema";
import type {
  StoreAssignmentInput,
  UpdateAssignmentInput,
} from "@/types/assignment.type";
import type { Database } from "@/types/database.type";

export const createAssignmentModel = (db: Database) => {
  return {
    async get() {
      const assignmentList = await db.select().from(tables.assignments);

      return assignmentList;
    },

    async store(data: StoreAssignmentInput) {
      const [assignment] = await db
        .insert(tables.assignments)
        .values(data)
        .returning({
          ...getTableColumns(tables.assignments),
        });

      return assignment;
    },

    async findByStudentId(studentId: string) {
      const assignment = await db
        .select()
        .from(tables.assignments)
        .where(eq(tables.assignments.studentId, studentId));

      return assignment;
    },

    async findById(id: string) {
      const [assignment] = await db
        .select()
        .from(tables.assignments)
        .where(eq(tables.assignments.id, id));

      return assignment ?? null;
    },

    async update(id: string, data: UpdateAssignmentInput) {
      const [assignment] = await db
        .update(tables.assignments)
        .set(data)
        .where(eq(tables.assignments.id, id))
        .returning({
          ...getTableColumns(tables.assignments),
        });

      return assignment ?? null;
    },

    async remove(id: string) {
      const [assignment] = await db
        .delete(tables.assignments)
        .where(eq(tables.assignments.id, id))
        .returning({
          ...getTableColumns(tables.assignments),
        });

      return assignment ?? null;
    },
  };
};
