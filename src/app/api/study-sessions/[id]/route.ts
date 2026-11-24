import { createStudySessionModel } from "@/models/study-session.model";
import {
  studySessionSearchParamsSchema,
  studySessionUpdateFormSchema,
} from "@/schemas/study-session.schema";
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
    const studySession = await createStudySessionModel(database()).findById(
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

export async function PATCH(
  request: Request,
  context: StudySessionRouteContext,
): Promise<Response> {
  const paramsValidation = await getValidatedParams(request, context);
  if (!paramsValidation.success) {
    return Response.json(
      { error: "A valid study session ID and studentId are required." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const bodyValidation = studySessionUpdateFormSchema.safeParse(body);
  if (!bodyValidation.success) {
    return Response.json(
      {
        error: "Invalid study session information.",
        issues: bodyValidation.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  try {
    const studySession = await createStudySessionModel(database()).update(
      paramsValidation.data.id,
      paramsValidation.data.studentId,
      bodyValidation.data,
    );
    if (!studySession)
      return Response.json(
        { error: "Study session not found." },
        { status: 404 },
      );
    return Response.json({ data: studySession });
  } catch {
    return Response.json(
      { error: "Unable to update the study session." },
      { status: 500 },
    );
  }
}

export async function DELETE(
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
    const studySession = await createStudySessionModel(database()).remove(
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
      { error: "Unable to remove the study session." },
      { status: 500 },
    );
  }
}
