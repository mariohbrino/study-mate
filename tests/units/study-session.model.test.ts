import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createStudentModel } from "@/models/student.model";
import { createStudySessionModel } from "@/models/study-session.model";
import { database } from "@/services/database.service";
import type { Database } from "@/types/database.type";

describe("study session model", () => {
  const missingId = "00000000-0000-0000-0000-000000000000";
  let client: Database;
  let studySessionModel: ReturnType<typeof createStudySessionModel>;
  let studentModel: ReturnType<typeof createStudentModel>;

  const createStudent = async (clerkId: string) =>
    studentModel.store({ clerkId, timezone: "UTC" });

  const createStudySession = async (
    studentId: string,
    title = "Study session",
  ) =>
    studySessionModel.store(studentId, {
      title,
      subject: "Computer Science",
      scheduledAt: new Date("2026-12-01T10:00:00.000Z"),
      durationMinutes: "60",
    });

  beforeAll(() => {
    client = database();
    studySessionModel = createStudySessionModel(client);
    studentModel = createStudentModel(client);
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("returns an empty list when a student has no study sessions", async () => {
    const student = await createStudent("study-session-empty");
    expect(await studySessionModel.get(student.id)).toEqual([]);
  });

  it("lists only the study sessions for the requested student", async () => {
    const student = await createStudent("study-session-list");
    const otherStudent = await createStudent("study-session-other-list");
    await createStudySession(student.id, "Session one");
    await createStudySession(student.id, "Session two");
    await createStudySession(otherStudent.id, "Other session");

    const sessions = await studySessionModel.get(student.id);
    expect(sessions).toHaveLength(2);
    expect(sessions.every((session) => session.studentId === student.id)).toBe(
      true,
    );
  });

  it("creates a study session for a student", async () => {
    const student = await createStudent("study-session-create");
    const session = await createStudySession(student.id);

    expect(session).toEqual(
      expect.objectContaining({
        studentId: student.id,
        title: "Study session",
        subject: "Computer Science",
        durationMinutes: "60",
      }),
    );
    expect(session.id).toBeDefined();
  });

  it("finds a study session by ID for its student", async () => {
    const student = await createStudent("study-session-find");
    const session = await createStudySession(student.id);
    expect(await studySessionModel.findById(session.id, student.id)).toEqual(
      session,
    );
  });

  it("does not return a study session to a different student", async () => {
    const student = await createStudent("study-session-owner");
    const otherStudent = await createStudent("study-session-non-owner");
    const session = await createStudySession(student.id);
    expect(
      await studySessionModel.findById(session.id, otherStudent.id),
    ).toBeNull();
  });

  it("updates a study session", async () => {
    const student = await createStudent("study-session-update");
    const session = await createStudySession(student.id);
    const updated = await studySessionModel.update(session.id, student.id, {
      title: "Updated session",
      durationMinutes: "90",
    });

    expect(updated?.title).toBe("Updated session");
    expect(updated?.durationMinutes).toBe("90");
  });

  it("does not update a session belonging to another student", async () => {
    const student = await createStudent("study-session-update-owner");
    const otherStudent = await createStudent("study-session-update-other");
    const session = await createStudySession(student.id);
    expect(
      await studySessionModel.update(session.id, otherStudent.id, {
        title: "Nope",
      }),
    ).toBeNull();
    expect(
      (await studySessionModel.findById(session.id, student.id))?.title,
    ).toBe("Study session");
  });

  it("deletes a study session", async () => {
    const student = await createStudent("study-session-delete");
    const session = await createStudySession(student.id);
    expect(await studySessionModel.remove(session.id, student.id)).toEqual(
      session,
    );
    expect(await studySessionModel.findById(session.id, student.id)).toBeNull();
  });

  it("does not delete a session belonging to another student", async () => {
    const student = await createStudent("study-session-delete-owner");
    const otherStudent = await createStudent("study-session-delete-other");
    const session = await createStudySession(student.id);
    expect(
      await studySessionModel.remove(session.id, otherStudent.id),
    ).toBeNull();
    expect(
      await studySessionModel.findById(session.id, student.id),
    ).not.toBeNull();
  });

  it("returns null for a session that does not exist", async () => {
    expect(await studySessionModel.findById(missingId, missingId)).toBeNull();
    expect(
      await studySessionModel.update(missingId, missingId, {
        title: "Missing",
      }),
    ).toBeNull();
    expect(await studySessionModel.remove(missingId, missingId)).toBeNull();
  });
});
