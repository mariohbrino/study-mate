import { getAuthenticatedStudent } from "@/domains/student.domain";
import { createStudySessionModel } from "@/models/study-session.model";
import { studySessionListParamsSchema } from "@/schemas/study-session.schema";
import { database } from "@/services/database.service";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const validation = studySessionListParamsSchema.safeParse({
    studentId: searchParams.get("studentId"),
  });
  if (!validation.success) {
    return Response.json(
      { error: "A valid studentId query parameter is required." },
      { status: 400 },
    );
  }

  try {
    const authenticatedStudent = await getAuthenticatedStudent();
    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const studySessions = await createStudySessionModel(database()).get(
      validation.data.studentId,
    );
    return Response.json({ data: studySessions });
  } catch {
    return Response.json(
      { error: "Unable to retrieve study sessions." },
      { status: 500 },
    );
  }
}
