import { getAuthStudent } from "@/domains/student.domain";
import { createStudySessionModel } from "@/models/study-session.model";
import { database } from "@/services/database.service";

export async function GET(): Promise<Response> {
  try {
    const authenticatedStudent = await getAuthStudent();
    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const studySessionModel = createStudySessionModel(database());
    const studySessions = await studySessionModel.get(authenticatedStudent.id);
    return Response.json({ data: studySessions });
  } catch (error) {
    console.log("An error occurred while retrieving study sessions:", error);
    return Response.json(
      { error: "Unable to retrieve study sessions." },
      { status: 500 },
    );
  }
}
