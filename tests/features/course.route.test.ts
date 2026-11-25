import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { GET as getCourse } from "@/app/api/courses/[id]/route";
import { GET as getCourses } from "@/app/api/courses/route";
import { createCourseModel } from "@/models/course.model";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

describe("course API route handlers", () => {
  let client: ReturnType<typeof database>;
  let studentModel: ReturnType<typeof createStudentModel>;
  let courseModel: ReturnType<typeof createCourseModel>;
  const missingId = "00000000-0000-4000-8000-000000000000";

  beforeAll(() => {
    client = database();
    studentModel = createStudentModel(client);
    courseModel = createCourseModel(client);
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  const createCourses = async () => {
    const student = await studentModel.store({
      clerkId: "clerk-create-test",
      timezone: "UTC",
    });

    const course1 = await courseModel.store(student.id, {
      name: "Test Course 1",
    });

    const course2 = await courseModel.store(student.id, {
      name: "Test Course 2",
    });

    const course3 = await courseModel.store(student.id, {
      name: "Test Course 3",
    });

    const courses = [course1, course2, course3];

    return { courses, student };
  };

  it("returns all courses", async () => {
    const { courses } = await createCourses();

    const response = await getCourses();
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: [
        expect.objectContaining({ id: courses[0].id }),
        expect.objectContaining({ id: courses[1].id }),
        expect.objectContaining({ id: courses[2].id }),
      ],
    });
  });

  it("returns an empty list when there are no courses", async () => {
    const response = await getCourses();
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: [] });
  });

  it("returns a course by route ID", async () => {
    const { courses } = await createCourses();
    const created = courses[0];

    const response = await getCourse(
      new Request(`http://localhost/api/courses/${created.id}`),
      { params: Promise.resolve({ id: created.id }) },
    );
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: expect.objectContaining({ id: created.id }),
    });
  });

  it("rejects an invalid route ID", async () => {
    const response = await getCourse(
      new Request("http://localhost/api/courses/invalid-id"),
      { params: Promise.resolve({ id: "invalid-id" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid course ID.",
    });
  });

  it("returns 404 when a course does not exist", async () => {
    const response = await getCourse(
      new Request(`http://localhost/api/courses/${missingId}`),
      { params: Promise.resolve({ id: missingId }) },
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Course not found.",
    });
  });
});
