import { sql } from "drizzle-orm";
import {
  foreignKey,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { assignments } from "@/database/schemas/assignments.schema";
import { students } from "@/database/schemas/students.schema";

export const studySessions = pgTable(
  "study_sessions",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    studentId: uuid("student_id").notNull(),
    assignmentId: uuid("assignment_id"),
    title: varchar("title", { length: 200 }).notNull(),
    subject: varchar("subject", { length: 120 }),
    scheduledAt: timestamp("scheduled_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    durationMinutes: varchar("duration_minutes", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("study_sessions_title_key").on(table.title, table.studentId),
    foreignKey({
      name: "study_sessions_student_id_fkey",
      columns: [table.studentId],
      foreignColumns: [students.id],
    }),
    foreignKey({
      name: "study_sessions_assignment_id_fkey",
      columns: [table.assignmentId],
      foreignColumns: [assignments.id],
    }),
  ],
);
