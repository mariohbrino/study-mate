import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

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
    uniqueIndex("courses_student_id_name_key").on(table.studentId, table.name),
  ],
);
