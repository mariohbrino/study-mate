import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { loadDatabaseConfig } from "@/configs/database.config";
import { createSslOptions } from "@/utils/database.util";

const globalForDb = globalThis as unknown as {
  databaseClient?: ReturnType<typeof createDatabase>;
};

const createDatabase = () => {
  const config = loadDatabaseConfig();
  const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    ssl: createSslOptions(config),
  });

  pool.on("error", (error) => {
    console.error("Unexpected database pool error", error);
  });

  return drizzle({ client: pool });
};

export const database = () => {
  if (globalForDb.databaseClient) {
    return globalForDb.databaseClient;
  }

  globalForDb.databaseClient = createDatabase();
  return globalForDb.databaseClient;
};
