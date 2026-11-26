import { describe, expect, it } from "vitest";

import {
  assignmentFormSchema,
  assignmentSearchParamsSchema,
  assignmentUpdateFormSchema,
} from "@/schemas/assignments.schema";

const validAssignment = {
  title: "Complete project",
  description: "Finish the project work",
  course: "WDD430",
  dueAt: "2026-12-01T10:00:00.000Z",
  status: "pending",
};

describe("assignment schemas", () => {
  it("accepts valid assignment form data", () => {
    expect(assignmentFormSchema.safeParse(validAssignment).success).toBe(true);
  });

  it("rejects an empty title", () => {
    expect(
      assignmentFormSchema.safeParse({
        ...validAssignment,
        title: " ",
      }).success,
    ).toBe(false);
  });

  it("rejects missing or invalid due dates", () => {
    expect(
      assignmentFormSchema.safeParse({
        ...validAssignment,
        dueAt: "",
      }).success,
    ).toBe(false);

    expect(
      assignmentFormSchema.safeParse({
        ...validAssignment,
        dueAt: "not-a-date",
      }).success,
    ).toBe(false);
  });

  it("rejects invalid assignment statuses", () => {
    expect(
      assignmentFormSchema.safeParse({
        ...validAssignment,
        status: "started",
      }).success,
    ).toBe(false);
  });

  it("accepts all three allowed statuses", () => {
    for (const status of ["pending", "in_progress", "completed"]) {
      expect(
        assignmentFormSchema.safeParse({
          ...validAssignment,
          status,
        }).success,
      ).toBe(true);
    }
  });

  it("rejects updates without permitted fields", () => {
    expect(assignmentUpdateFormSchema.safeParse({}).success).toBe(false);
  });

  it("accepts an update with at least one valid field", () => {
    expect(
      assignmentUpdateFormSchema.safeParse({
        title: "Updated assignment",
      }).success,
    ).toBe(true);
  });

  it("accepts valid UUIDs and rejects invalid assignment IDs", () => {
    expect(
      assignmentSearchParamsSchema.safeParse({
        id: "00000000-0000-4000-8000-000000000003",
      }).success,
    ).toBe(true);

    expect(
      assignmentSearchParamsSchema.safeParse({
        id: "invalid-id",
      }).success,
    ).toBe(false);
  });
});
