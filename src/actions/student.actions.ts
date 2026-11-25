"use server";

import { createStudentModel } from "@/models/student.model";
import {
  studentFormSchema,
  studentSearchParamsSchema,
  studentUpdateFormSchema,
} from "@/schemas/student.schema";
import { database } from "@/services/database.service";
import type { Student } from "@/types/student.type";

type StudentActionResult =
  | { success: true; data: Student }
  | { success: false; error: string; issues?: string[] };

const formDataToObject = (
  formData: FormData,
): Record<string, FormDataEntryValue> => Object.fromEntries(formData.entries());

export async function storeStudent(
  formData: FormData,
): Promise<StudentActionResult> {
  const validated = studentFormSchema.safeParse(formDataToObject(formData));

  if (!validated.success) {
    return {
      success: false,
      error: "Please correct the student information.",
      issues: validated.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const studentModel = createStudentModel(database());
    const student = await studentModel.store(validated.data);
    return { success: true, data: student };
  } catch {
    return {
      success: false,
      error: "Unable to create the student record.",
    };
  }
}

export async function updateStudent(
  studentId: string,
  formData: FormData,
): Promise<StudentActionResult> {
  const params = studentSearchParamsSchema.safeParse({ id: studentId });
  if (!params.success) {
    return { success: false, error: "Invalid student ID." };
  }

  const validated = studentUpdateFormSchema.safeParse(
    formDataToObject(formData),
  );

  if (!validated.success) {
    return {
      success: false,
      error: "Please correct the student information.",
      issues: validated.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const studentModel = createStudentModel(database());
    const student = await studentModel.update(params.data.id, validated.data);

    if (!student) {
      return { success: false, error: "Student not found." };
    }

    return { success: true, data: student };
  } catch {
    return {
      success: false,
      error: "Unable to update the student record.",
    };
  }
}

export async function removeStudent(
  studentId: string,
): Promise<StudentActionResult> {
  const params = studentSearchParamsSchema.safeParse({ id: studentId });
  if (!params.success) {
    return { success: false, error: "Invalid student ID." };
  }

  try {
    const studentModel = createStudentModel(database());
    const student = await studentModel.remove(params.data.id);

    if (!student) {
      return { success: false, error: "Student not found." };
    }

    return { success: true, data: student };
  } catch {
    return {
      success: false,
      error: "Unable to remove the student record.",
    };
  }
}
