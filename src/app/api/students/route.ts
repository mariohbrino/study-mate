import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

export async function GET(): Promise<Response> {
  try {
    const studentModels = createStudentModel(database());
    const students = await studentModels.get();

    return Response.json({ data: students });
  } catch (error) {
    console.error("Unable to retrieve student records.", error);
    return Response.json(
      { error: "Unable to retrieve student records." },
      { status: 500 },
    );
  }
}
