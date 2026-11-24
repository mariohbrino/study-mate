import { createStudySessionModel } from "@/models/study-session.model";
import {
  studySessionFormSchema,
  studySessionListParamsSchema,
} from "@/schemas/study-session.schema";
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

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const validation = studySessionFormSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      {
        error: "Invalid study session information.",
        issues: validation.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  const { studentId, ...data } = validation.data;
  try {
    const studySession = await createStudySessionModel(database()).store(
      studentId,
      data,
    );
    return Response.json({ data: studySession }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Unable to create the study session." },
      { status: 500 },
    );
  }
}
