"use server";

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

export async function storeStudySession(
  formData: FormData,
): Promise<StudySessionActionResult> {
  const validation = studySessionFormSchema.safeParse(
    formDataToObject(formData),
  );
  if (!validation.success) {
    return {
      success: false,
      error: "Please correct the study session information.",
      issues: validation.error.issues.map((issue) => issue.message),
    };
  }

  const { studentId, ...data } = validation.data;
  try {
    const studySession = await createStudySessionModel(database()).store(
      studentId,
      data,
    );
    return { success: true, data: studySession };
  } catch {
    return { success: false, error: "Unable to create the study session." };
  }
}

export async function updateStudySession(
  searchParams: { id: string; studentId: string },
  formData: FormData,
): Promise<StudySessionActionResult> {
  const paramsValidation =
    studySessionSearchParamsSchema.safeParse(searchParams);
  if (!paramsValidation.success) {
    return { success: false, error: "Invalid study session or student ID." };
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
    const studySession = await createStudySessionModel(database()).update(
      paramsValidation.data.id,
      paramsValidation.data.studentId,
      formValidation.data,
    );
    if (!studySession)
      return { success: false, error: "Study session not found." };
    return { success: true, data: studySession };
  } catch {
    return { success: false, error: "Unable to update the study session." };
  }
}

export async function removeStudySession(searchParams: {
  id: string;
  studentId: string;
}): Promise<StudySessionActionResult> {
  const validation = studySessionSearchParamsSchema.safeParse(searchParams);
  if (!validation.success) {
    return { success: false, error: "Invalid study session or student ID." };
  }

  try {
    const studySession = await createStudySessionModel(database()).remove(
      validation.data.id,
      validation.data.studentId,
    );
    if (!studySession)
      return { success: false, error: "Study session not found." };
    return { success: true, data: studySession };
  } catch {
    return { success: false, error: "Unable to remove the study session." };
  }
}
