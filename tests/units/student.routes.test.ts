import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { GET as getStudent } from "@/app/api/students/[id]/route";
import { GET as getStudents } from "@/app/api/students/route";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

describe("student API route handlers", () => {
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

  it("returns all students", async () => {
    const model = createStudentModel(client);
    await model.store({
      clerkId: "clerk-route-list",
      timezone: "UTC",
    });

    const response = await getStudents();
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: [expect.objectContaining({ clerkId: "clerk-route-list" })],
    });
  });

  it("returns an empty list when there are no students", async () => {
    const response = await getStudents();
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: [] });
  });

  it("returns a student by route ID", async () => {
    const created = await createStudentModel(client).store({
      clerkId: "clerk-route-id",
      timezone: "UTC",
    });

    const response = await getStudent(
      new Request(`http://localhost/api/students/${created.id}`),
      { params: Promise.resolve({ id: created.id }) },
    );
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: expect.objectContaining({ id: created.id }),
    });
  });

  it("rejects an invalid route ID", async () => {
    const response = await getStudent(
      new Request("http://localhost/api/students/invalid-id"),
      { params: Promise.resolve({ id: "invalid-id" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid student ID.",
    });
  });

  it("returns 404 when a student does not exist", async () => {
    const missingId = "00000000-0000-4000-8000-000000000000";
    const response = await getStudent(
      new Request(`http://localhost/api/students/${missingId}`),
      { params: Promise.resolve({ id: missingId }) },
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Student not found.",
    });
  });
});
