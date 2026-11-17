import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

describe("student model unit tests", () => {
  let client: ReturnType<typeof database>;
  let studentModel: ReturnType<typeof createStudentModel>;

  beforeAll(() => {
    client = database();
    studentModel = createStudentModel(client);
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("should create a student", async () => {
    const student = await studentModel.store({
      clerkId: "clerk-create-test",
      timezone: "Africa/Accra",
    });

    expect(student).toEqual(
      expect.objectContaining({
        clerkId: "clerk-create-test",
        timezone: "Africa/Accra",
      }),
    );
    expect(student.id).toBeDefined();
  });

  it("should find a student by ID", async () => {
    const created = await studentModel.store({
      clerkId: "clerk-find-id-test",
      timezone: "UTC",
    });

    const result = await studentModel.findById(created.id);

    expect(result).toEqual(created);
  });

  it("should find a student by Clerk ID", async () => {
    await studentModel.store({
      clerkId: "clerk-find-clerk-test",
      timezone: "UTC",
    });

    const result = await studentModel.findByClerkId("clerk-find-clerk-test");

    expect(result?.clerkId).toBe("clerk-find-clerk-test");
  });

  it("should return null when a student is not found", async () => {
    const result = await studentModel.findByClerkId("missing-clerk-id");

    expect(result).toBeNull();
  });

  it("should update a student's timezone", async () => {
    const created = await studentModel.store({
      clerkId: "clerk-update-test",
      timezone: "UTC",
    });

    const updated = await studentModel.update(created.id, {
      timezone: "Africa/Accra",
    });

    expect(updated?.timezone).toBe("Africa/Accra");
  });

  it("should delete a student", async () => {
    const created = await studentModel.store({
      clerkId: "clerk-delete-test",
      timezone: "UTC",
    });

    const deleted = await studentModel.remove(created.id);
    const result = await studentModel.findById(created.id);

    expect(deleted?.id).toBe(created.id);
    expect(result).toBeNull();
  });
});
