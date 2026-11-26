"use server";

import { revalidatePath } from "next/cache";

import { getAuthStudent } from "@/domains/student.domain";
import { createAssignmentModel } from "@/models/assignment.model";
import {
  assignmentFormSchema,
  assignmentSearchParamsSchema,
  assignmentUpdateFormSchema,
} from "@/schemas/assignments.schema";
import { database } from "@/services/database.service";
import type { Assignment } from "@/types/assignment.type";

type SafeAssignment = Omit<Assignment, "studentId">;

type AssignmentActionResult =
  | { success: true; data: SafeAssignment }
  | { success: false; error: string; issues?: string[] };

const formDataToObject = (
  formData: FormData,
): Record<string, FormDataEntryValue> => Object.fromEntries(formData.entries());

const toSafeAssignment = (assignment: Assignment): SafeAssignment =>
  Object.fromEntries(
    Object.entries(assignment).filter(([key]) => key !== "studentId"),
  ) as SafeAssignment;

export async function storeAssignment(
  formData: FormData,
): Promise<AssignmentActionResult> {
  try {
    const authStudent = await getAuthStudent();

    if (!authStudent) {
      return { success: false, error: "Unauthorized." };
    }

    const validated = assignmentFormSchema.safeParse(
      formDataToObject(formData),
    );

    if (!validated.success) {
      return {
        success: false,
        error: "Please correct the assignment information.",
        issues: validated.error.issues.map((issue) => issue.message),
      };
    }

    const assignmentModel = createAssignmentModel(database());

    const assignment = await assignmentModel.store(
      authStudent.id,
      validated.data,
    );

    revalidatePath("/assignments");

    return {
      success: true,
      data: toSafeAssignment(assignment),
    };
  } catch {
    return {
      success: false,
      error: "Unable to create the assignment.",
    };
  }
}

export async function updateAssignment(
  assignmentId: string,
  formData: FormData,
): Promise<AssignmentActionResult> {
  try {
    const authStudent = await getAuthStudent();

    if (!authStudent) {
      return { success: false, error: "Unauthorized." };
    }

    const params = assignmentSearchParamsSchema.safeParse({
      id: assignmentId,
    });

    if (!params.success) {
      return {
        success: false,
        error: "Invalid assignment ID.",
      };
    }

    const validated = assignmentUpdateFormSchema.safeParse(
      formDataToObject(formData),
    );

    if (!validated.success) {
      return {
        success: false,
        error: "Please correct the assignment information.",
        issues: validated.error.issues.map((issue) => issue.message),
      };
    }

    const assignmentModel = createAssignmentModel(database());

    const assignment = await assignmentModel.update(
      params.data.id,
      authStudent.id,
      validated.data,
    );

    if (!assignment) {
      return {
        success: false,
        error: "Assignment not found.",
      };
    }

    revalidatePath("/assignments");

    return {
      success: true,
      data: toSafeAssignment(assignment),
    };
  } catch {
    return {
      success: false,
      error: "Unable to update the assignment.",
    };
  }
}

export async function removeAssignment(
  assignmentId: string,
): Promise<AssignmentActionResult> {
  try {
    const authStudent = await getAuthStudent();

    if (!authStudent) {
      return { success: false, error: "Unauthorized." };
    }

    const params = assignmentSearchParamsSchema.safeParse({
      id: assignmentId,
    });

    if (!params.success) {
      return {
        success: false,
        error: "Invalid assignment ID.",
      };
    }

    const assignmentModel = createAssignmentModel(database());

    const assignment = await assignmentModel.remove(
      params.data.id,
      authStudent.id,
    );

    if (!assignment) {
      return {
        success: false,
        error: "Assignment not found.",
      };
    }

    revalidatePath("/assignments");

    return {
      success: true,
      data: toSafeAssignment(assignment),
    };
  } catch {
    return {
      success: false,
      error: "Unable to remove the assignment.",
    };
  }
}
