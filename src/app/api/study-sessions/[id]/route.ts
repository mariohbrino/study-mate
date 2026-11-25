import { getAuthenticatedStudent } from "@/domains/student.domain";
import { createStudySessionModel } from "@/models/study-session.model";
import { studySessionSearchParamsSchema } from "@/schemas/study-session.schema";
import { database } from "@/services/database.service";

type StudySessionRouteContext = {
  params: Promise<{ id: string }>;
};

const getValidatedParams = async (
  request: Request,
  context: StudySessionRouteContext,
) => {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  return studySessionSearchParamsSchema.safeParse({
    id,
    studentId: searchParams.get("studentId"),
  });
};

export async function GET(
  request: Request,
  context: StudySessionRouteContext,
): Promise<Response> {
  const validation = await getValidatedParams(request, context);
  if (!validation.success) {
    return Response.json(
      { error: "A valid study session ID and studentId are required." },
      { status: 400 },
    );
  }

  try {
    const authenticatedStudent = await getAuthenticatedStudent();
    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const studySessionModel = createStudySessionModel(database());
    const studySession = await studySessionModel.findById(
      validation.data.id,
      validation.data.studentId,
    );
    if (!studySession)
      return Response.json(
        { error: "Study session not found." },
        { status: 404 },
      );
    return Response.json({ data: studySession });
  } catch {
    return Response.json(
      { error: "Unable to retrieve the study session." },
      { status: 500 },
    );
  }
}
