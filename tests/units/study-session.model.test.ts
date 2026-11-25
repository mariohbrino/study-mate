import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createAssignmentModel } from "@/models/assignment.model";
import { createStudentModel } from "@/models/student.model";
import { createStudySessionModel } from "@/models/study-session.model";
import { database } from "@/services/database.service";
import type { Database } from "@/types/database.type";
import type { UpdateStudySessionInput } from "@/types/study-session.type";

describe("study session model unit tests", () => {
  const missingId = "00000000-0000-0000-0000-000000000000";
  let client: Database;
  let assignmentModel: ReturnType<typeof createAssignmentModel>;
  let studentModel: ReturnType<typeof createStudentModel>;
  let studySessionModel: ReturnType<typeof createStudySessionModel>;

  const createStudySessions = async () => {
    const student = await studentModel.store({
      clerkId: "clerk-study-session-test",
      timezone: "Africa/Accra",
    });

    const assignment = await assignmentModel.store({
      studentId: student.id,
      title: "Study session assignment",
      description: "Assignment for a study session",
      status: "pending",
      course: "Biology",
      dueAt: new Date(),
    });

    const studySession = await studySessionModel.store({
      studentId: student.id,
      assignmentId: assignment!.id,
      title: "Study session 1",
      subject: "Biology",
      scheduledAt: new Date("2026-11-21T10:00:00.000Z"),
      durationMinutes: 60,
    });

    return { student, assignment, studySession };
  };

  beforeAll(() => {
    client = database();
    assignmentModel = createAssignmentModel(client);
    studentModel = createStudentModel(client);
    studySessionModel = createStudySessionModel(client);
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("retrieves an empty list of study sessions", async () => {
    await expect(studySessionModel.get()).resolves.toEqual([]);
  });

  it("creates and retrieves study sessions for a student", async () => {
    const { student, studySession } = await createStudySessions();

    expect(studySession).toEqual(
      expect.objectContaining({
        studentId: student.id,
        title: "Study session 1",
        subject: "Biology",
        durationMinutes: 60,
      }),
    );
    await expect(studySessionModel.get()).resolves.toEqual([studySession]);
    await expect(
      studySessionModel.findByStudentId(student.id),
    ).resolves.toEqual([studySession]);
    await expect(studySessionModel.findById(studySession!.id)).resolves.toEqual(
      studySession,
    );
  });

  it("updates an existing study session", async () => {
    const { studySession } = await createStudySessions();
    const data: UpdateStudySessionInput = {
      title: "Updated study session",
      subject: "Chemistry",
      durationMinutes: 90,
    };

    const updated = await studySessionModel.update(studySession!.id, data);

    expect(updated).toEqual(
      expect.objectContaining({
        id: studySession!.id,
        title: "Updated study session",
        subject: "Chemistry",
        durationMinutes: 90,
      }),
    );
    expect(updated!.updatedAt.getTime()).toBeGreaterThanOrEqual(
      studySession!.updatedAt.getTime(),
    );
  });

  it("deletes a study session", async () => {
    const { studySession } = await createStudySessions();

    await expect(studySessionModel.remove(studySession!.id)).resolves.toEqual(
      studySession,
    );
    await expect(
      studySessionModel.findById(studySession!.id),
    ).resolves.toBeNull();
  });

  it("unlinks a deleted assignment without deleting its study session", async () => {
    const { assignment, studySession } = await createStudySessions();

    await assignmentModel.remove(assignment!.id);

    await expect(studySessionModel.findById(studySession!.id)).resolves.toEqual(
      expect.objectContaining({ assignmentId: null }),
    );
  });

  it("returns null for missing records on find, update, and remove", async () => {
    await expect(studySessionModel.findById(missingId)).resolves.toBeNull();
    await expect(
      studySessionModel.update(missingId, { title: "Missing session" }),
    ).resolves.toBeNull();
    await expect(studySessionModel.remove(missingId)).resolves.toBeNull();
  });
});
