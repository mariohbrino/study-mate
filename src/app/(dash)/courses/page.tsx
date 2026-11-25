import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

async function CoursesContent() {
  await auth.protect();
  return <main className="mx-auto max-w-7xl px-6 py-8">Courses</main>;
}

export default function CoursesPage() {
  return (
    <Suspense fallback={null}>
      <CoursesContent />
    </Suspense>
  );
}
