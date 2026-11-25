import { createCourseModel } from "@/models/course.model";
import { courseIdSchema } from "@/schemas/course.schema";
import { database } from "@/services/database.service";

type CourseRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: CourseRouteContext,
): Promise<Response> {
  const { id } = await context.params;
  const validation = courseIdSchema.safeParse({ id });

  if (!validation.success) {
    return Response.json({ error: "Invalid course ID." }, { status: 400 });
  }

  try {
    const course = await createCourseModel(database()).findById(
      validation.data.id,
    );

    if (!course) {
      return Response.json({ error: "Course not found." }, { status: 404 });
    }

    return Response.json({ data: course });
  } catch {
    return Response.json(
      { error: "Unable to retrieve the course record." },
      { status: 500 },
    );
  }
}
