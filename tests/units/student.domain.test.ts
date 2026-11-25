import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

vi.unmock("@/domains/student.domain");

import { findOrCreateStudent } from "@/domains/student.domain";
import { database } from "@/services/database.service";

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: vi.fn() },
}));

describe("student domain", () => {
  let client: ReturnType<typeof database>;

  beforeAll(() => {
    client = database();
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("creates a student for a new clerk user", async () => {
    const student = await findOrCreateStudent(
      "clerk-domain-new",
      "Africa/Accra",
    );

    expect(student.clerkId).toBe("clerk-domain-new");
    expect(student.timezone).toBe("Africa/Accra");
  });

  it("returns the same student for a returning clerk user", async () => {
    const first = await findOrCreateStudent("clerk-domain-return");
    const second = await findOrCreateStudent(
      "clerk-domain-return",
      "Asia/Tokyo",
    );

    expect(second.id).toBe(first.id);
    expect(second.timezone).toBe("UTC");
  });

  it("rejects an empty clerk id", async () => {
    await expect(findOrCreateStudent("  ")).rejects.toThrow();
  });
});
