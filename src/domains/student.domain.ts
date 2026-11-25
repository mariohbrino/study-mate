import { auth } from "@clerk/nextjs/server";

import { createStudentModel } from "@/models/student.model";
import { studentFormSchema } from "@/schemas/student.schema";
import { database } from "@/services/database.service";

export const findOrCreateStudent = async (
  clerkId: string,
  defaultTimezone: string = "UTC",
) => {
  const input = studentFormSchema.parse({
    clerkId,
    timezone: defaultTimezone,
  });
  const studentModel = createStudentModel(database());

  const student = await studentModel.findByClerkId(input.clerkId);
  if (student) {
    return student;
  }

  // Concurrent first requests can race; the unique clerk_id index turns the
  // losing insert into a no-op, so we re-read the row the winner created.
  const created = await studentModel.storeIfMissing(input);
  if (created) {
    return created;
  }

  const existing = await studentModel.findByClerkId(input.clerkId);
  if (!existing) {
    throw new Error("Unable to find or create student.");
  }

  return existing;
};

export const getAuthStudent = async (defaultTimezone?: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }
    return findOrCreateStudent(userId, defaultTimezone);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest: unknown }).digest === "HANGING_PROMISE_REJECTION"
    ) {
      return null; // safe during prerender / build
    }
    throw error;
  }
};
