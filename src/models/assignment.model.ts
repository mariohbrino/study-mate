import { and, eq, getTableColumns } from "drizzle-orm";

import * as tables from "@/database/schema";
import type {
  StoreAssignmentInput,
  UpdateAssignmentInput,
} from "@/types/assignment.type";
import type { Database } from "@/types/database.type";

export const createAssignmentModel = (db: Database) => {
  return {
    async get(studentId: string) {
      return db
        .select()
        .from(tables.assignments)
        .where(eq(tables.assignments.studentId, studentId));
    },

    async store(
      studentId: string,
      data: Omit<StoreAssignmentInput, "studentId">,
    ) {
      const [assignment] = await db
        .insert(tables.assignments)
        .values({ ...data, studentId })
        .returning({
          ...getTableColumns(tables.assignments),
        });

      return assignment;
    },

    async findByStudentId(studentId: string) {
      return db
        .select()
        .from(tables.assignments)
        .where(eq(tables.assignments.studentId, studentId));
    },

    async findById(id: string, studentId: string) {
      const [assignment] = await db
        .select()
        .from(tables.assignments)
        .where(
          and(
            eq(tables.assignments.id, id),
            eq(tables.assignments.studentId, studentId),
          ),
        );

      return assignment ?? null;
    },

    async update(id: string, studentId: string, data: UpdateAssignmentInput) {
      const [assignment] = await db
        .update(tables.assignments)
        .set(data)
        .where(
          and(
            eq(tables.assignments.id, id),
            eq(tables.assignments.studentId, studentId),
          ),
        )
        .returning({
          ...getTableColumns(tables.assignments),
        });

      return assignment ?? null;
    },

    async remove(id: string, studentId: string) {
      const [assignment] = await db
        .delete(tables.assignments)
        .where(
          and(
            eq(tables.assignments.id, id),
            eq(tables.assignments.studentId, studentId),
          ),
        )
        .returning({
          ...getTableColumns(tables.assignments),
        });

      return assignment ?? null;
    },
  };
};
