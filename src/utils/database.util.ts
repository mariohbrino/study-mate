import type { DatabaseConfig } from "@/types/database.type";
import type { PoolConfig } from "pg";

export const createSslOptions = (config: DatabaseConfig): PoolConfig["ssl"] => {
  return config.sslMode ? { rejectUnauthorized: config.sslMode } : false;
};
