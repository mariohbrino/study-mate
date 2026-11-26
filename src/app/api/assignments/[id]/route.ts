import { getAuthStudent } from "@/domains/student.domain";
import { createAssignmentModel } from "@/models/assignment.model";
import { assignmentSearchParamsSchema } from "@/schemas/assignments.schema";
import { database } from "@/services/database.service";
import type { Assignment } from "@/types/assignment.type";

type AssignmentRouteContext = {
  params: Promise<{ id: string }>;
};

const getValidatedParams = async (context: AssignmentRouteContext) => {
  const { id } = await context.params;
  return assignmentSearchParamsSchema.safeParse({ id });
};

const toSafeAssignment = (
  assignment: Assignment,
): Omit<Assignment, "studentId"> =>
  Object.fromEntries(
    Object.entries(assignment).filter(([key]) => key !== "studentId"),
  ) as Omit<Assignment, "studentId">;

export async function GET(
  _request: Request,
  context: AssignmentRouteContext,
): Promise<Response> {
  try {
    const authenticatedStudent = await getAuthStudent();

    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const validation = await getValidatedParams(context);

    if (!validation.success) {
      return Response.json(
        { error: "A valid assignment ID is required." },
        { status: 400 },
      );
    }

    const assignmentModel = createAssignmentModel(database());

    const assignment = await assignmentModel.findById(
      validation.data.id,
      authenticatedStudent.id,
    );

    if (!assignment) {
      return Response.json({ error: "Assignment not found." }, { status: 404 });
    }

    return Response.json({
      data: toSafeAssignment(assignment),
    });
  } catch (error) {
    console.error("Unable to retrieve the assignment.", error);

    return Response.json(
      { error: "Unable to retrieve the assignment." },
      { status: 500 },
    );
  }
}
