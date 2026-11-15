import type { DatabaseConfig } from "@/types/database.type";
import { createSslOptions } from "@/utils/database.util";
import { describe, expect, it } from "vitest";

const createConfig = (sslMode: boolean): DatabaseConfig => ({
  host: "localhost",
  port: 5432,
  database: "study_mate",
  username: "test_user",
  password: "test_password",
  sslMode,
  isDevelopment: true,
});

describe("createSslOptions", () => {
  it("returns false when SSL mode is disabled", () => {
    const config = createConfig(false);

    expect(createSslOptions(config)).toBe(false);
  });

  it("returns rejectUnauthorized true when SSL mode is enabled", () => {
    const config = createConfig(true);

    expect(createSslOptions(config)).toEqual({
      rejectUnauthorized: true,
    });
  });
});
