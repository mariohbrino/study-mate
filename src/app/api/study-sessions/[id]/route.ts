import { getAuthStudent } from "@/domains/student.domain";
import { createStudySessionModel } from "@/models/study-session.model";
import { studySessionSearchParamsSchema } from "@/schemas/study-session.schema";
import { database } from "@/services/database.service";

type StudySessionRouteContext = {
  params: Promise<{ id: string }>;
};

const getValidatedParams = async (context: StudySessionRouteContext) => {
  const { id } = await context.params;
  return studySessionSearchParamsSchema.safeParse({ id });
};

export async function GET(
  _request: Request,
  context: StudySessionRouteContext,
): Promise<Response> {
  try {
    const authenticatedStudent = await getAuthStudent();
    if (!authenticatedStudent) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const validation = await getValidatedParams(context);
    if (!validation.success) {
      return Response.json(
        { error: "A valid study session ID is required." },
        { status: 400 },
      );
    }

    const studySessionModel = createStudySessionModel(database());
    const studySession = await studySessionModel.findById(
      validation.data.id,
      authenticatedStudent.id,
    );
    if (!studySession)
      return Response.json(
        { error: "Study session not found." },
        { status: 404 },
      );
    return Response.json({ data: studySession });
  } catch (error) {
    console.error("Unable to retrieve the study session.", error);
    return Response.json(
      { error: "Unable to retrieve the study session." },
      { status: 500 },
    );
  }
}
