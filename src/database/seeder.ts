import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import { Pool } from "pg";

import { loadDatabaseConfig } from "@/configs/database.config";
import * as schemas from "@/database/schema";
import type { Student } from "@/types/student.type";
import { createSslOptions } from "@/utils/database.util";

const configDatabase = () => {
  const config = loadDatabaseConfig();

  const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    ssl: createSslOptions(config),
  });

  return { db: drizzle({ client: pool }), pool };
};

const main = async () => {
  const { db, pool } = configDatabase();

  const student: Omit<Student, "id" | "createdAt" | "updatedAt">[] = [
    {
      clerkId: "clerk-id-test-data",
      timezone: "UTC",
    },
  ];

  const courses = ["Test Course 1", "Test Course 2", "Test Course 3"];

  try {
    await reset(db, schemas);

    // Seed test student data.
    const [user] = await db
      .insert(schemas.students)
      .values(student)
      .returning();

    // Seed test course data.
    await db
      .insert(schemas.courses)
      .values(
        courses.map((name) => ({
          name,
          studentId: user.id,
        })),
      )
      .returning();
  } finally {
    await pool.end();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
