import { beforeAll, describe, expect, it } from "vitest";

import { databaseClient } from "@tests/commons/database";
import { hasTable } from "@tests/utils/has-table";

describe("database migrations integrity tests", () => {
  let client: Awaited<ReturnType<typeof databaseClient>>;

  beforeAll(async () => {
    client = await databaseClient();
  });

  it("should have a valid database client", () => {
    expect(client).toBeDefined();
  });

  it("should have table students", async () => {
    const exists = await hasTable(client, "students");
    expect(exists).toBe(true);
  });

  it("should have table assignments", async () => {
    const exists = await hasTable(client, "assignments");
    expect(exists).toBe(true);
  });

  it("should have table study_sessions", async () => {
    const exists = await hasTable(client, "study_sessions");
    expect(exists).toBe(true);
  });
});
