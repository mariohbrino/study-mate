import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createCourseModel } from "@/models/courses.model";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

describe("course model unit tests", () => {
  let client: ReturnType<typeof database>;
  let studentModel: ReturnType<typeof createStudentModel>;
  let courseModel: ReturnType<typeof createCourseModel>;
  const missingId: string = "00000000-0000-4000-8000-000000000000";

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

    const course1 = await courseModel.store({
      name: "Test Course 1",
      studentId: student.id,
    });

    const course2 = await courseModel.store({
      name: "Test Course 2",
      studentId: student.id,
    });

    const course3 = await courseModel.store({
      name: "Test Course 3",
      studentId: student.id,
    });

    const courses = [course1, course2, course3];

    return { courses, student };
  };

  it("should retrieve a empty list of courses", async () => {
    const result = await courseModel.get();
    expect(result).toEqual([]);
  });

  it("should retrieve a list of courses", async () => {
    const { courses } = await createCourses();

    const result = await courseModel.get();

    expect(result).toEqual(courses);
  });

  it("should create a course", async () => {
    const { student } = await createCourses();
    const course = await courseModel.store({
      name: "Test Course",
      studentId: student.id,
    });
    expect(course.id).toBeDefined();
  });

  it("should retrieve a course by id", async () => {
    const { courses } = await createCourses();
    const course = courses[0];

    const result = await courseModel.findById(course.id);

    expect(result).toEqual(course);
  });

  it("should update a course", async () => {
    const { courses, student } = await createCourses();
    const course = courses[0];

    const result = await courseModel.update(course.id, {
      name: "Updated Course",
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: course.id,
        name: "Updated Course",
        studentId: student.id,
      }),
    );
  });

  it("should remove a course", async () => {
    const { courses } = await createCourses();
    const course = courses[0];

    await courseModel.remove(course.id);

    const result = await courseModel.findById(course.id);

    expect(result).toBeNull();
  });

  it("should find by student id", async () => {
    const { courses, student } = await createCourses();

    const result = await courseModel.findByStudentId(student.id);

    expect(result).toEqual(courses);
  });

  it("should return null when a course is not found", async () => {
    const result = await courseModel.findById(missingId);

    expect(result).toBeNull();
  });

  it("a non-existing course should return null when updating", async () => {
    const data = { name: "Updated Course" };
    const result = await courseModel.update(missingId, data);
    expect(result).toBeNull();
  });

  it("a non-existing course should return null when deleting", async () => {
    const result = await courseModel.remove(missingId);
    expect(result).toBeNull();
  });

  it("should throw when the ID is not a valid UUID for findById", async () => {
    await expect(courseModel.findById("non-valid-id")).rejects.toThrow();
  });

  it("should throw when the ID is not a valid UUID for update", async () => {
    const data = { name: "Updated Course" };
    await expect(courseModel.update("non-valid-id", data)).rejects.toThrow();
  });

  it("should throw when the ID is not a valid UUID for delete", async () => {
    await expect(courseModel.remove("non-valid-id")).rejects.toThrow();
  });
});
