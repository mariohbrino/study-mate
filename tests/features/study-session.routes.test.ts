import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { GET as getStudySessions } from "@/app/api/study-sessions/route";
import { createStudentModel } from "@/models/student.model";
import { createStudySessionModel } from "@/models/study-session.model";
import { database } from "@/services/database.service";
import type { Database } from "@/types/database.type";

describe("study session API routes", () => {
  let client: Database;
  let studentModel: ReturnType<typeof createStudentModel>;

  beforeAll(() => {
    client = database();
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
    studentModel = createStudentModel(client);
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  const createStudySession = async (withStudySession: boolean = true) => {
    let studySession;

    const student = await studentModel.store({
      id: "00000000-0000-4000-8000-000000000000",
      clerkId: `study-session-route-${crypto.randomUUID()}`,
      timezone: "UTC",
    });

    if (withStudySession) {
      studySession = await createStudySessionModel(client).store(student.id, {
        title: "Study session",
        subject: "Computer Science",
        scheduledAt: new Date("2026-12-01T10:00:00.000Z"),
        durationMinutes: "60",
      });
    }

    return {
      student,
      studySession,
    };
  };

  it("should return an empty list when there are no study sessions", async () => {
    await createStudySession(false);

    const response = await getStudySessions();
    expect(response.status).toBe(200);

    const list = (await response.json()) as {
      data: Array<{ id: string; studentId: string }>;
    };
    expect(list.data).toHaveLength(0);
  });

  it("lists study sessions", async () => {
    const { studySession, student } = await createStudySession();
    expect(studySession).toBeDefined();

    const response = await getStudySessions();
    expect(response.status).toBe(200);

    const list = (await response.json()) as {
      data: Array<{ id: string; studentId: string }>;
    };
    expect(list.data).toHaveLength(1);
    expect(list.data[0].id).toBe(studySession!.id);
    expect(list.data[0].studentId).toBe(student.id);
  });
});
