import { revalidatePath } from "next/cache";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { removeCourse, updateCourse } from "@/actions/course.action";
import { createCourseModel } from "@/models/course.model";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";
import type { CourseState } from "@/types/course.type";
import type { Database } from "@/types/database.type";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

describe("course server actions", () => {
  let client: Database;
  let studentModel: ReturnType<typeof createStudentModel>;
  let courseModel: ReturnType<typeof createCourseModel>;

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

  it("returns validation errors for invalid form data", async () => {
    const { courses } = await createCourses();
    const [course] = courses;
    const prevState: CourseState = {};

    const result = await updateCourse(prevState, course.id, new FormData());

    expect(result.message).toBe("Please fix the errors below and try again.");
    expect(result.errors?.name).toEqual(["Name is required."]);
    expect(result.values).toEqual({ name: "" });
  });

  it("returns an error for an invalid course id", async () => {
    const formData = new FormData();
    formData.set("name", "Renamed");

    const result = await updateCourse({}, "not-a-uuid", formData);

    expect(result.message).toBe("Invalid course ID");
    expect(result.values).toEqual({ name: "Renamed" });
  });

  it("updates the course, revalidates and redirects on valid data", async () => {
    const { courses } = await createCourses();
    const [course] = courses;
    const formData = new FormData();
    formData.set("name", "  Renamed Course  ");

    await expect(updateCourse({}, course.id, formData)).rejects.toThrow(
      "NEXT_REDIRECT:/courses",
    );

    expect((await courseModel.findById(course.id))?.name).toBe(
      "Renamed Course",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/courses");
  });

  it("does not modify the course when validation fails", async () => {
    const { courses } = await createCourses();
    const [course] = courses;

    await updateCourse({}, course.id, new FormData());

    expect((await courseModel.findById(course.id))?.name).toBe(course.name);
  });

  it("removes the course, revalidates and redirects", async () => {
    const { courses } = await createCourses();
    const [course] = courses;

    await expect(removeCourse(course.id)).rejects.toThrow(
      "NEXT_REDIRECT:/courses",
    );

    expect(await courseModel.findById(course.id)).toBeNull();
    expect(revalidatePath).toHaveBeenCalledWith("/courses");
  });

  it("rejects an invalid course id on remove", async () => {
    await expect(removeCourse("not-a-uuid")).rejects.toThrow(
      "Invalid course ID",
    );
  });
});
