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
  const validation = studentFormSchema.safeParse(formDataToObject(formData));

  if (!validation.success) {
    return {
      success: false,
      error: "Please correct the student information.",
      issues: validation.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const student = await createStudentModel(database()).store(validation.data);
    return { success: true, data: student };
  } catch {
    return {
      success: false,
      error: "Unable to create the student record.",
    };
  }
}

export async function updateStudent(
  searchParams: { id: string },
  formData: FormData,
): Promise<StudentActionResult> {
  const paramsValidation = studentSearchParamsSchema.safeParse(searchParams);

  if (!paramsValidation.success) {
    return { success: false, error: "Invalid student ID." };
  }

  const formValidation = studentUpdateFormSchema.safeParse(
    formDataToObject(formData),
  );

  if (!formValidation.success) {
    return {
      success: false,
      error: "Please correct the student information.",
      issues: formValidation.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const student = await createStudentModel(database()).update(
      paramsValidation.data.id,
      formValidation.data,
    );

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

export async function removeStudent(searchParams: {
  id: string;
}): Promise<StudentActionResult> {
  const validation = studentSearchParamsSchema.safeParse(searchParams);

  if (!validation.success) {
    return { success: false, error: "Invalid student ID." };
  }

  try {
    const student = await createStudentModel(database()).remove(
      validation.data.id,
    );

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
