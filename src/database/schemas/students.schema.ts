import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const students = pgTable(
  "students",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    clerkId: varchar("clerk_id", { length: 255 }).notNull(),
    timezone: varchar("timezone", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("students_clerk_id_key").on(table.clerkId)],
);
