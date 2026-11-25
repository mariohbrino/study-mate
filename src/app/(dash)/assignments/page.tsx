import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

async function AssignmentsContent() {
  await auth.protect();
  return <main className="mx-auto max-w-7xl px-6 py-8">Assignments</main>;
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={null}>
      <AssignmentsContent />
    </Suspense>
  );
}
