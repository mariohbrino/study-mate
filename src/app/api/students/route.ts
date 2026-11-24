import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

export async function GET(): Promise<Response> {
  try {
    const students = await createStudentModel(database()).get();

    return Response.json({ data: students });
  } catch {
    return Response.json(
      { error: "Unable to retrieve student records." },
      { status: 500 },
    );
  }
}
