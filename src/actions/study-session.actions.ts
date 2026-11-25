"use server";

import { getAuthStudent } from "@/domains/student.domain";
import { createAssignmentModel } from "@/models/assignment.model";
import { createStudySessionModel } from "@/models/study-session.model";
import {
  studySessionFormSchema,
  studySessionSearchParamsSchema,
  studySessionUpdateFormSchema,
} from "@/schemas/study-session.schema";
import { database } from "@/services/database.service";
import type { StudySession } from "@/types/study-session.type";

type StudySessionActionResult =
  | { success: true; data: StudySession }
  | { success: false; error: string; issues?: string[] };

const formDataToObject = (
  formData: FormData,
): Record<string, FormDataEntryValue> => Object.fromEntries(formData.entries());

const assignmentBelongsToStudent = async (
  assignmentId: string | null | undefined,
  studentId: string,
): Promise<boolean> => {
  if (!assignmentId) return true;

  const assignment = await createAssignmentModel(database()).findById(
    assignmentId,
    studentId,
  );
  return assignment !== null;
};

export async function storeStudySession(
  formData: FormData,
): Promise<StudySessionActionResult> {
  const authStudent = await getAuthStudent();
  if (!authStudent) {
    return { success: false, error: "Unauthorized." };
  }

  const validated = studySessionFormSchema.safeParse(
    formDataToObject(formData),
  );

  if (!validated.success) {
    return {
      success: false,
      error: "Please correct the study session information.",
      issues: validated.error.issues.map((issue) => issue.message),
    };
  }

  try {
    if (
      !(await assignmentBelongsToStudent(
        validated.data.assignmentId,
        authStudent.id,
      ))
    ) {
      return { success: false, error: "Assignment not found." };
    }

    const studySessionModel = createStudySessionModel(database());
    const studySession = await studySessionModel.store(
      authStudent.id,
      validated.data,
    );
    return { success: true, data: studySession };
  } catch {
    return { success: false, error: "Unable to create the study session." };
  }
}

export async function updateStudySession(
  studySessionId: string,
  formData: FormData,
): Promise<StudySessionActionResult> {
  const authStudent = await getAuthStudent();
  if (!authStudent) {
    return { success: false, error: "Unauthorized." };
  }

  const params = studySessionSearchParamsSchema.safeParse({
    id: studySessionId,
  });
  if (!params.success) {
    return { success: false, error: "Invalid study session ID." };
  }

  const formValidation = studySessionUpdateFormSchema.safeParse(
    formDataToObject(formData),
  );
  if (!formValidation.success) {
    return {
      success: false,
      error: "Please correct the study session information.",
      issues: formValidation.error.issues.map((issue) => issue.message),
    };
  }

  try {
    if (
      !(await assignmentBelongsToStudent(
        formValidation.data.assignmentId,
        authStudent.id,
      ))
    ) {
      return { success: false, error: "Assignment not found." };
    }

    const studySessionModel = createStudySessionModel(database());
    const studySession = await studySessionModel.update(
      params.data.id,
      authStudent.id,
      formValidation.data,
    );
    if (!studySession)
      return { success: false, error: "Study session not found." };
    return { success: true, data: studySession };
  } catch {
    return { success: false, error: "Unable to update the study session." };
  }
}

export async function removeStudySession(
  studySessionId: string,
): Promise<StudySessionActionResult> {
  const authStudent = await getAuthStudent();
  if (!authStudent) {
    return { success: false, error: "Unauthorized." };
  }

  const params = studySessionSearchParamsSchema.safeParse({
    id: studySessionId,
  });
  if (!params.success) {
    return { success: false, error: "Invalid study session ID." };
  }

  try {
    const studySessionModel = createStudySessionModel(database());
    const studySession = await studySessionModel.remove(
      params.data.id,
      authStudent.id,
    );
    if (!studySession)
      return { success: false, error: "Study session not found." };
    return { success: true, data: studySession };
  } catch {
    return { success: false, error: "Unable to remove the study session." };
  }
}
