import { eq } from "drizzle-orm";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { assignments, students, studySessions } from "@/database/schema";
import { database } from "@/services/database.service";

describe("database client unit tests", () => {
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

  it("should insert and retrieve a student correctly", async () => {
    const student = { clerkId: "clerk-test-id", timezone: "UTC" };
    await client.insert(students).values(student);

    const result = await client
      .select()
      .from(students)
      .where(eq(students.clerkId, student.clerkId));

    expect(result[0]).toEqual(expect.objectContaining(student));
  });

  it("should insert and retrieve an assignment correctly", async () => {
    const [student] = await client
      .insert(students)
      .values({ clerkId: "clerk-assignment-test-id", timezone: "UTC" })
      .returning({ id: students.id });

    const assignment = {
      studentId: student.id,
      title: "Test assignment",
      description: "Test assignment description",
      course: "Test course",
      status: "pending",
      dueAt: new Date(),
    } satisfies typeof assignments.$inferInsert;
    await client.insert(assignments).values(assignment);

    const result = await client
      .select()
      .from(assignments)
      .where(eq(assignments.studentId, assignment.studentId));

    expect(result[0]).toEqual(expect.objectContaining(assignment));
  });

  it("should insert and retrieve a study session correctly", async () => {
    const [student] = await client
      .insert(students)
      .values({ clerkId: "clerk-study-session-test-id", timezone: "UTC" })
      .returning({ id: students.id });

    const studySession = {
      studentId: student.id,
      title: "Test study session",
      durationMinutes: "60",
    } satisfies typeof studySessions.$inferInsert;
    await client.insert(studySessions).values(studySession);

    const result = await client
      .select()
      .from(studySessions)
      .where(eq(studySessions.studentId, studySession.studentId));

    expect(result[0]).toEqual(expect.objectContaining(studySession));
  });
});
