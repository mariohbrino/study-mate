import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

async function StudyPlannerContent() {
  await auth.protect();
  return <main className="mx-auto max-w-7xl px-6 py-8">Study Planner</main>;
}

export default function StudyPlannerPage() {
  return (
    <Suspense fallback={null}>
      <StudyPlannerContent />
    </Suspense>
  );
}
