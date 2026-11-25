import { eq } from "drizzle-orm";

import { courses } from "@/database/schema";
import type { StoreCourseInput, UpdateCourseInput } from "@/types/course.type";
import type { Database } from "@/types/database.type";

export const createCourseModel = (db: Database) => {
  return {
    async get() {
      const courseList = await db.select().from(courses);
      return courseList;
    },

    async store(data: StoreCourseInput) {
      const [course] = await db.insert(courses).values(data).returning();

      return course;
    },

    async findById(id: string) {
      const [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, id));

      return course ?? null;
    },

    async findByStudentId(studentId: string) {
      const course = await db
        .select()
        .from(courses)
        .where(eq(courses.studentId, studentId));

      return course;
    },

    async update(id: string, data: UpdateCourseInput) {
      const [course] = await db
        .update(courses)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(courses.id, id))
        .returning();

      return course ?? null;
    },

    async remove(id: string) {
      const [course] = await db
        .delete(courses)
        .where(eq(courses.id, id))
        .returning();

      return course ?? null;
    },
  };
};
