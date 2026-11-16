import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";

export const databaseClient = async () => {
  const db = new PGlite();
  const client = drizzle({ client: db });

  await migrate(client, {
    migrationsFolder: path.join(__dirname, "../../drizzle"),
  });

  return client;
};
