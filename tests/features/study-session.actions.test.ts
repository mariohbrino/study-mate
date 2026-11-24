import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import {
  removeStudySession,
  storeStudySession,
  updateStudySession,
} from "@/actions/study-session.actions";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";
import type { Database } from "@/types/database.type";

describe("study session server actions", () => {
  let client: Database;
  let studentId: string;

  beforeAll(() => {
    client = database();
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
    const student = await createStudentModel(client).store({
      clerkId: `study-session-action-${crypto.randomUUID()}`,
      timezone: "UTC",
    });
    studentId = student.id;
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("creates a study session from form data", async () => {
    const formData = new FormData();
    formData.set("studentId", studentId);
    formData.set("title", "Action-created session");
    formData.set("subject", "History");
    formData.set("scheduledAt", "2026-12-01T10:00:00.000Z");
    formData.set("durationMinutes", "45");

    const result = await storeStudySession(formData);
    expect(result.success).toBe(true);
    if (result.success)
      expect(result.data.title).toBe("Action-created session");
  });

  it("returns validation errors for invalid form data", async () => {
    const result = await storeStudySession(new FormData());
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues).toBeDefined();
  });

  it("updates and removes a study session", async () => {
    const formData = new FormData();
    formData.set("studentId", studentId);
    formData.set("title", "Before update");
    formData.set("scheduledAt", "2026-12-01T10:00:00.000Z");
    formData.set("durationMinutes", "30");
    const created = await storeStudySession(formData);
    expect(created.success).toBe(true);
    if (!created.success) return;

    const updateData = new FormData();
    updateData.set("title", "After update");
    const updated = await updateStudySession(
      { id: created.data.id, studentId },
      updateData,
    );
    expect(updated.success).toBe(true);
    if (updated.success) expect(updated.data.title).toBe("After update");

    const removed = await removeStudySession({
      id: created.data.id,
      studentId,
    });
    expect(removed.success).toBe(true);
  });

  it("rejects invalid identifiers for update and remove", async () => {
    const updateResult = await updateStudySession(
      { id: "invalid", studentId },
      new FormData(),
    );
    const removeResult = await removeStudySession({ id: "invalid", studentId });
    expect(updateResult.success).toBe(false);
    expect(removeResult.success).toBe(false);
  });
});
