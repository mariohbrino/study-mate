import { getAuthStudent } from "@/domains/student.domain";
import { createStudentModel } from "@/models/student.model";
import { studentSearchParamsSchema } from "@/schemas/student.schema";
import { database } from "@/services/database.service";

type StudentRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: StudentRouteContext,
): Promise<Response> {
  try {
    const authenticatedStudent = await getAuthStudent();
    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const validation = studentSearchParamsSchema.safeParse({ id });

    if (!validation.success) {
      return Response.json({ error: "Invalid student ID." }, { status: 400 });
    }

    const student = await createStudentModel(database()).findById(
      validation.data.id,
    );

    if (!student) {
      return Response.json({ error: "Student not found." }, { status: 404 });
    }

    return Response.json({ data: student });
  } catch (error) {
    console.error("Unable to retrieve the student record.", error);
    return Response.json(
      { error: "Unable to retrieve the student record." },
      { status: 500 },
    );
  }
}
