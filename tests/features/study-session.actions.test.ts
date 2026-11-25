import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import {
  removeStudySession,
  storeStudySession,
  updateStudySession,
} from "@/actions/study-session.actions";
import { createAssignmentModel } from "@/models/assignment.model";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";
import type { Database } from "@/types/database.type";

describe("study session server actions", () => {
  let client: Database;
  let studentModel: ReturnType<typeof createStudentModel>;
  const authStudentId = "00000000-0000-4000-8000-000000000000";

  const createAuthStudent = () =>
    studentModel.store({
      id: authStudentId,
      clerkId: `study-session-action-${crypto.randomUUID()}`,
      timezone: "UTC",
    });

  beforeAll(() => {
    client = database();
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
    studentModel = createStudentModel(client);
    await createAuthStudent();
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("creates a study session from form data", async () => {
    const formData = new FormData();
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
    formData.set("title", "Before update");
    formData.set("scheduledAt", "2026-12-01T10:00:00.000Z");
    formData.set("durationMinutes", "30");
    const created = await storeStudySession(formData);
    expect(created.success).toBe(true);
    if (!created.success) return;

    const updateData = new FormData();
    updateData.set("title", "After update");
    const updated = await updateStudySession(created.data.id, updateData);
    expect(updated.success).toBe(true);
    if (updated.success) expect(updated.data.title).toBe("After update");

    const removed = await removeStudySession(created.data.id);
    expect(removed.success).toBe(true);
  });

  describe("assignment ownership", () => {
    const createAssignment = async (studentId: string) =>
      createAssignmentModel(client).store(studentId, {
        title: `Assignment ${crypto.randomUUID()}`,
        description: "Description",
        course: "Course",
        status: "pending",
        dueAt: new Date("2026-12-05T10:00:00.000Z"),
      });

    const createOtherStudentAssignment = async () => {
      const other = await studentModel.store({
        clerkId: `study-session-other-${crypto.randomUUID()}`,
        timezone: "UTC",
      });
      return createAssignment(other.id);
    };

    const sessionFormData = (assignmentId: string) => {
      const formData = new FormData();
      formData.set("title", "Linked session");
      formData.set("scheduledAt", "2026-12-01T10:00:00.000Z");
      formData.set("durationMinutes", "30");
      formData.set("assignmentId", assignmentId);
      return formData;
    };

    it("links the student's own assignment on create", async () => {
      const assignment = await createAssignment(authStudentId);

      const result = await storeStudySession(sessionFormData(assignment.id));
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.assignmentId).toBe(assignment.id);
    });

    it("rejects another student's assignment on create", async () => {
      const foreign = await createOtherStudentAssignment();

      const result = await storeStudySession(sessionFormData(foreign.id));
      expect(result).toEqual({
        success: false,
        error: "Assignment not found.",
      });
    });

    it("rejects another student's assignment on update", async () => {
      const foreign = await createOtherStudentAssignment();
      const created = await storeStudySession(sessionFormData(""));
      expect(created.success).toBe(true);
      if (!created.success) return;

      const updateData = new FormData();
      updateData.set("assignmentId", foreign.id);
      const result = await updateStudySession(created.data.id, updateData);
      expect(result).toEqual({
        success: false,
        error: "Assignment not found.",
      });
    });
  });

  it("rejects invalid identifiers for update and remove", async () => {
    const updateResult = await updateStudySession("invalid", new FormData());
    const removeResult = await removeStudySession("invalid");
    const expected = {
      success: false,
      error: "Invalid study session ID.",
    };
    expect(updateResult).toEqual(expected);
    expect(removeResult).toEqual(expected);
  });
});
