import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { students } from "@/database/schemas/students.schema";

export const assignments = pgTable(
  "assignments",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    studentId: uuid("student_id").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    course: varchar("course", { length: 255 }).notNull(),
    dueAt: timestamp("due_at", { mode: "date" }).notNull().defaultNow(),
    status: varchar("status", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("assignments_title_key").on(table.title, table.studentId),
    foreignKey({
      name: "assignments_student_id_fkey",
      columns: [table.studentId],
      foreignColumns: [students.id],
    }),
    check(
      "assignments_status_check",
      sql`${table.status} IN ('pending', 'in_progress', 'completed')`,
    ),
  ],
);
