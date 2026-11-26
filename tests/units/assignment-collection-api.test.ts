import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/assignments/route";
import { getAuthStudent } from "@/domains/student.domain";
import { createAssignmentModel } from "@/models/assignment.model";

vi.mock("@/domains/student.domain", () => ({
  getAuthStudent: vi.fn(),
}));

vi.mock("@/models/assignment.model", () => ({
  createAssignmentModel: vi.fn(),
}));

vi.mock("@/services/database.service", () => ({
  database: vi.fn(),
}));

describe("GET /api/assignments", () => {
  const student = {
    id: "00000000-0000-4000-8000-000000000001",
  };

  const assignments = [
    {
      id: "00000000-0000-4000-8000-000000000002",
      studentId: student.id,
      title: "Complete project",
      description: "Finish the project work",
      course: "WDD430",
      dueAt: new Date("2026-12-01T10:00:00.000Z"),
      status: "pending",
      createdAt: new Date("2026-11-21T10:00:00.000Z"),
      updatedAt: new Date("2026-11-21T10:00:00.000Z"),
    },
  ];

  const getAssignments = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getAuthStudent).mockResolvedValue(student as never);

    getAssignments.mockResolvedValue(assignments);

    vi.mocked(createAssignmentModel).mockReturnValue({
      get: getAssignments,
    } as never);
  });

  it("returns the authenticated student's assignments", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("Complete project");
    expect(body.data[0]).not.toHaveProperty("studentId");
    expect(getAssignments).toHaveBeenCalledWith(student.id);
  });

  it("returns an empty list when the student has no assignments", async () => {
    getAssignments.mockResolvedValue([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
  });

  it("returns 401 when the user is not authenticated", async () => {
    vi.mocked(getAuthStudent).mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized.");
    expect(createAssignmentModel).not.toHaveBeenCalled();
  });

  it("returns 500 when assignment retrieval fails", async () => {
    getAssignments.mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Unable to retrieve assignments.");
  });
});
