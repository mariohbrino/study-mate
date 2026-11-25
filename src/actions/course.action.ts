"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createCourseModel } from "@/models/course.model";
import { courseIdSchema, courseUpdateSchema } from "@/schemas/course.schema";
import { database } from "@/services/database.service";
import type { CourseState } from "@/types/course.type";

export async function updateCourse(
  _prevState: CourseState,
  courseId: string,
  formData: FormData,
): Promise<CourseState> {
  const values = {
    name: formData.get("name")?.toString() ?? "",
  };

  const validatedId = await courseIdSchema.safeParseAsync({ id: courseId });
  if (!validatedId.success) {
    return {
      message: "Invalid course ID",
      values,
    };
  }

  const validated = await courseUpdateSchema.safeParseAsync(values);
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error).fieldErrors,
      message: "Please fix the errors below and try again.",
      values,
    };
  }

  const courseModel = createCourseModel(database());

  try {
    await courseModel.update(validatedId.data.id, validated.data);
  } catch (error) {
    console.log("Error occurred while updating course", error);
    throw new Error("Failed to update course");
  }

  revalidatePath("/courses");
  redirect("/courses");
}

export async function removeCourse(courseId: string): Promise<void> {
  const validated = await courseIdSchema.safeParseAsync({ id: courseId });
  if (!validated.success) {
    throw new Error("Invalid course ID");
  }

  const courseModel = createCourseModel(database());

  try {
    await courseModel.remove(validated.data.id);
  } catch (error) {
    console.log("Error occurred while deleting course", error);
    throw new Error("Failed to delete course");
  }

  revalidatePath("/courses");
  redirect("/courses");
}
