import { describe, expect, it } from "vitest";

import {
  studySessionFormSchema,
  studySessionListParamsSchema,
  studySessionSearchParamsSchema,
  studySessionUpdateFormSchema,
} from "@/schemas/study-session.schema";

const validSession = {
  studentId: "00000000-0000-4000-8000-000000000001",
  title: "Review database concepts",
  subject: "Computer Science",
  scheduledAt: "2026-12-01T10:00:00.000Z",
  durationMinutes: "60",
};

describe("study session schemas", () => {
  it("accepts valid study session form data", () => {
    expect(studySessionFormSchema.safeParse(validSession).success).toBe(true);
  });

  it("rejects an empty title", () => {
    expect(
      studySessionFormSchema.safeParse({ ...validSession, title: " " }).success,
    ).toBe(false);
  });

  it("rejects an invalid student ID", () => {
    expect(
      studySessionFormSchema.safeParse({
        ...validSession,
        studentId: "not-a-uuid",
      }).success,
    ).toBe(false);
  });

  it("rejects a missing or invalid scheduled date", () => {
    expect(
      studySessionFormSchema.safeParse({ ...validSession, scheduledAt: "" })
        .success,
    ).toBe(false);
    expect(
      studySessionFormSchema.safeParse({
        ...validSession,
        scheduledAt: "not-a-date",
      }).success,
    ).toBe(false);
  });

  it("rejects a non-positive or non-numeric duration", () => {
    expect(
      studySessionFormSchema.safeParse({
        ...validSession,
        durationMinutes: "0",
      }).success,
    ).toBe(false);
    expect(
      studySessionFormSchema.safeParse({
        ...validSession,
        durationMinutes: "one hour",
      }).success,
    ).toBe(false);
  });

  it("accepts an optional linked assignment", () => {
    expect(
      studySessionFormSchema.safeParse({
        ...validSession,
        assignmentId: "00000000-0000-4000-8000-000000000002",
      }).success,
    ).toBe(true);
  });

  it("accepts valid list and item search parameters", () => {
    expect(
      studySessionListParamsSchema.safeParse({
        studentId: validSession.studentId,
      }).success,
    ).toBe(true);
    expect(
      studySessionSearchParamsSchema.safeParse({
        id: "00000000-0000-4000-8000-000000000003",
        studentId: validSession.studentId,
      }).success,
    ).toBe(true);
  });

  it("requires at least one valid field for updates", () => {
    expect(studySessionUpdateFormSchema.safeParse({}).success).toBe(false);
    expect(
      studySessionUpdateFormSchema.safeParse({ title: "Updated title" })
        .success,
    ).toBe(true);
  });
});
