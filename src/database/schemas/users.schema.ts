import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid()
      .primaryKey()
      .default(sql`uuidv7()`),
    clerk_id: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_key").on(table.email),
    uniqueIndex("users_clerk_id_key").on(table.clerk_id),
  ],
);
