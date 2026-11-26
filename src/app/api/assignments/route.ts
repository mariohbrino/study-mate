import { getAuthStudent } from "@/domains/student.domain";
import { createAssignmentModel } from "@/models/assignment.model";
import { database } from "@/services/database.service";
import type { Assignment } from "@/types/assignment.type";

const toSafeAssignment = (
  assignment: Assignment,
): Omit<Assignment, "studentId"> =>
  Object.fromEntries(
    Object.entries(assignment).filter(([key]) => key !== "studentId"),
  ) as Omit<Assignment, "studentId">;

export async function GET(): Promise<Response> {
  try {
    const authenticatedStudent = await getAuthStudent();

    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const assignmentModel = createAssignmentModel(database());

    const assignments = await assignmentModel.get(authenticatedStudent.id);

    const safeAssignments = assignments.map(toSafeAssignment);

    return Response.json({ data: safeAssignments });
  } catch (error) {
    console.error("Unable to retrieve assignments.", error);

    return Response.json(
      { error: "Unable to retrieve assignments." },
      { status: 500 },
    );
  }
}
