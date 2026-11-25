import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { GET as getStudySession } from "@/app/api/study-sessions/[id]/route";
import { GET as getStudySessions } from "@/app/api/study-sessions/route";
import { createStudentModel } from "@/models/student.model";
import { createStudySessionModel } from "@/models/study-session.model";
import { database } from "@/services/database.service";
import type { Database } from "@/types/database.type";

describe("study session API routes", () => {
  let client: Database;
  let studentId: string;

  beforeAll(() => {
    client = database();
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  const createStudySession = async () => {
    const student = await createStudentModel(client).store({
      clerkId: `study-session-route-${crypto.randomUUID()}`,
      timezone: "UTC",
    });
    studentId = student.id;

    const studySession = await createStudySessionModel(client).store(
      studentId,
      {
        title: "Study session",
        subject: "Computer Science",
        scheduledAt: new Date("2026-12-01T10:00:00.000Z"),
        durationMinutes: "60",
      },
    );

    return {
      studentId,
      studySession,
    };
  };

  it("returns 400 when listing without a valid studentId", async () => {
    const response = await getStudySessions(
      new Request("http://localhost/api/study-sessions"),
    );
    expect(response.status).toBe(400);
  });

  it("lists study sessions", async () => {
    const { studentId } = await createStudySession();
    const response = await getStudySessions(
      new Request(`http://localhost/api/study-sessions?studentId=${studentId}`),
    );
    expect(response.status).toBe(200);
    const list = (await response.json()) as { data: Array<{ id: string }> };
    expect(Array.isArray(list.data)).toBe(true);
  });

  it("returns 400 for malformed route identifiers", async () => {
    const response = await getStudySession(
      new Request(
        "http://localhost/api/study-sessions/not-a-uuid?studentId=bad",
      ),
      { params: Promise.resolve({ id: "not-a-uuid" }) },
    );
    expect(response.status).toBe(400);
  });
  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });
});
