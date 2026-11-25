import { createCourseModel } from "@/models/course.model";
import { database } from "@/services/database.service";

export async function GET(): Promise<Response> {
  try {
    const courseModel = createCourseModel(database());

    const courses = await courseModel.get();

    return Response.json({ data: courses });
  } catch (error) {
    console.error("Unable to retrieve course records.", error);
    return Response.json(
      { error: "Unable to retrieve course records." },
      { status: 500 },
    );
  }
}
