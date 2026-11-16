import { afterAll, vi } from "vitest";

import type { databaseClient } from "@tests/utils/database.util";
import { databaseClient as pgliteClient } from "@tests/utils/database.util";

let client: Awaited<ReturnType<typeof databaseClient>> | undefined;

vi.mock("@/services/database.service", async () => {
  const clientInstance = await pgliteClient();
  client = clientInstance;

  return { database: () => clientInstance };
});

afterAll(async () => {
  await client?.$client.close();
});
