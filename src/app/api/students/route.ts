import { getAuthenticatedStudent } from "@/domains/student.domain";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

export async function GET(): Promise<Response> {
  try {
    const authenticatedStudent = await getAuthenticatedStudent();
    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const studentModels = createStudentModel(database());
    const students = await studentModels.get();

    return Response.json({ data: students });
  } catch {
    return Response.json(
      { error: "Unable to retrieve student records." },
      { status: 500 },
    );
  }
}
