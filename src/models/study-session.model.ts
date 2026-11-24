import { and, eq, getTableColumns } from "drizzle-orm";

import * as tables from "@/database/schema";
import type { Database } from "@/types/database.type";
import type {
  StoreStudySessionInput,
  UpdateStudySessionInput,
} from "@/types/study-session.type";

export const createStudySessionModel = (db: Database) => {
  return {
    async get(studentId: string) {
      return db
        .select()
        .from(tables.studySessions)
        .where(eq(tables.studySessions.studentId, studentId));
    },

    async store(
      studentId: string,
      data: Omit<StoreStudySessionInput, "studentId">,
    ) {
      const [studySession] = await db
        .insert(tables.studySessions)
        .values({ ...data, studentId })
        .returning({ ...getTableColumns(tables.studySessions) });

      return studySession;
    },

    async findById(id: string, studentId: string) {
      const [studySession] = await db
        .select()
        .from(tables.studySessions)
        .where(
          and(
            eq(tables.studySessions.id, id),
            eq(tables.studySessions.studentId, studentId),
          ),
        );

      return studySession ?? null;
    },

    async update(id: string, studentId: string, data: UpdateStudySessionInput) {
      const [studySession] = await db
        .update(tables.studySessions)
        .set({ ...data, updatedAt: new Date() })
        .where(
          and(
            eq(tables.studySessions.id, id),
            eq(tables.studySessions.studentId, studentId),
          ),
        )
        .returning({ ...getTableColumns(tables.studySessions) });

      return studySession ?? null;
    },

    async remove(id: string, studentId: string) {
      const [studySession] = await db
        .delete(tables.studySessions)
        .where(
          and(
            eq(tables.studySessions.id, id),
            eq(tables.studySessions.studentId, studentId),
          ),
        )
        .returning({ ...getTableColumns(tables.studySessions) });

      return studySession ?? null;
    },
  };
};
