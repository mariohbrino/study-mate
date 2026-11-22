import { sql } from "drizzle-orm";
import {
  foreignKey,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { students } from "@/database/schemas/students.schema";

export const courses = pgTable(
  "courses",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    studentId: uuid("student_id").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "courses_student_id_fkey",
      columns: [table.studentId],
      foreignColumns: [students.id],
    })
      .onDelete("restrict")
      .onUpdate("restrict"),
    uniqueIndex("courses_name_key").on(table.name, table.studentId),
  ],
);
