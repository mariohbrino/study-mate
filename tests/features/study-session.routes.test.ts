import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import {
  DELETE,
  GET as getStudySession,
  PATCH,
} from "@/app/api/study-sessions/[id]/route";
import { GET as getStudySessions, POST } from "@/app/api/study-sessions/route";
import { createStudentModel } from "@/models/student.model";
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
    const student = await createStudentModel(client).store({
      clerkId: `study-session-route-${crypto.randomUUID()}`,
      timezone: "UTC",
    });
    studentId = student.id;
  });

  it("returns 400 when listing without a valid studentId", async () => {
    const response = await getStudySessions(
      new Request("http://localhost/api/study-sessions"),
    );
    expect(response.status).toBe(400);
  });

  it("creates and lists study sessions", async () => {
    const response = await POST(
      new Request("http://localhost/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          title: "API study session",
          subject: "Math",
          scheduledAt: "2026-12-01T10:00:00.000Z",
          durationMinutes: "45",
        }),
      }),
    );

    expect(response.status).toBe(201);
    const created = (await response.json()) as { data: { id: string } };

    const listResponse = await getStudySessions(
      new Request(`http://localhost/api/study-sessions?studentId=${studentId}`),
    );
    expect(listResponse.status).toBe(200);
    const list = (await listResponse.json()) as { data: Array<{ id: string }> };
    expect(list.data.some((session) => session.id === created.data.id)).toBe(
      true,
    );
  });

  it("rejects invalid create payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, title: "", durationMinutes: "0" }),
      }),
    );
    expect(response.status).toBe(400);
  });

  it("reads, updates, and deletes a study session", async () => {
    const createResponse = await POST(
      new Request("http://localhost/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          title: "Session before update",
          scheduledAt: "2026-12-01T10:00:00.000Z",
          durationMinutes: "30",
        }),
      }),
    );
    const created = (await createResponse.json()) as { data: { id: string } };
    const context = { params: Promise.resolve({ id: created.data.id }) };
    const url = `http://localhost/api/study-sessions/${created.data.id}?studentId=${studentId}`;

    const readResponse = await getStudySession(new Request(url), context);
    expect(readResponse.status).toBe(200);

    const updateResponse = await PATCH(
      new Request(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Session after update" }),
      }),
      context,
    );
    expect(updateResponse.status).toBe(200);
    const updated = (await updateResponse.json()) as {
      data: { title: string };
    };
    expect(updated.data.title).toBe("Session after update");

    const deleteResponse = await DELETE(
      new Request(url, { method: "DELETE" }),
      context,
    );
    expect(deleteResponse.status).toBe(200);

    const missingResponse = await getStudySession(new Request(url), context);
    expect(missingResponse.status).toBe(404);
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
