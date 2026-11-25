import { connection } from "next/server";

import { getAuthenticatedStudent } from "@/domains/student.domain";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";

export async function GET(): Promise<Response> {
  // Defer to request time so the prerender abort is not caught by the try/catch.
  await connection();

  try {
    const authenticatedStudent = await getAuthenticatedStudent();
    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

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
