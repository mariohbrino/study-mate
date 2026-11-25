import { eq, getTableColumns } from "drizzle-orm";

import * as tables from "@/database/schema";
import type { Database } from "@/types/database.type";
import type {
  StoreStudySessionInput,
  UpdateStudySessionInput,
} from "@/types/study-session.type";

export const createStudySessionModel = (db: Database) => {
  return {
    async get() {
      const studySessionList = await db.select().from(tables.studySessions);

      return studySessionList;
    },

    async store(data: StoreStudySessionInput) {
      const [studySession] = await db
        .insert(tables.studySessions)
        .values(data)
        .returning({
          ...getTableColumns(tables.studySessions),
        });

      return studySession;
    },

    async findByStudentId(studentId: string) {
      const studySessions = await db
        .select()
        .from(tables.studySessions)
        .where(eq(tables.studySessions.studentId, studentId));

      return studySessions;
    },

    async findById(id: string) {
      const [studySession] = await db
        .select()
        .from(tables.studySessions)
        .where(eq(tables.studySessions.id, id));

      return studySession ?? null;
    },

    async update(id: string, data: UpdateStudySessionInput) {
      const [studySession] = await db
        .update(tables.studySessions)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(tables.studySessions.id, id))
        .returning({
          ...getTableColumns(tables.studySessions),
        });

      return studySession ?? null;
    },

    async remove(id: string) {
      const [studySession] = await db
        .delete(tables.studySessions)
        .where(eq(tables.studySessions.id, id))
        .returning({
          ...getTableColumns(tables.studySessions),
        });

      return studySession ?? null;
    },
  };
};
