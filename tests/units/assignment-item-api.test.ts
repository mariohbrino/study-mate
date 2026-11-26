import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/assignments/[id]/route";
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

describe("GET /api/assignments/[id]", () => {
  const student = {
    id: "00000000-0000-4000-8000-000000000001",
  };

  const assignmentId = "00000000-0000-4000-8000-000000000002";

  const assignment = {
    id: assignmentId,
    studentId: student.id,
    title: "Complete project",
    description: "Finish the project work",
    course: "WDD430",
    dueAt: new Date("2026-12-01T10:00:00.000Z"),
    status: "pending",
    createdAt: new Date("2026-11-21T10:00:00.000Z"),
    updatedAt: new Date("2026-11-21T10:00:00.000Z"),
  };

  const findById = vi.fn();

  const createContext = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getAuthStudent).mockResolvedValue(student as never);
    findById.mockResolvedValue(assignment);

    vi.mocked(createAssignmentModel).mockReturnValue({
      findById,
    } as never);
  });

  it("returns the assignment belonging to the authenticated student", async () => {
    const response = await GET(
      new Request("http://localhost/api/assignments/" + assignmentId),
      createContext(assignmentId),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.id).toBe(assignmentId);
    expect(body.data.title).toBe("Complete project");
    expect(body.data).not.toHaveProperty("studentId");
    expect(findById).toHaveBeenCalledWith(assignmentId, student.id);
  });

  it("returns 401 when the user is not authenticated", async () => {
    vi.mocked(getAuthStudent).mockResolvedValue(null);

    const response = await GET(
      new Request("http://localhost/api/assignments/" + assignmentId),
      createContext(assignmentId),
    );

    expect(response.status).toBe(401);
    expect(findById).not.toHaveBeenCalled();
  });

  it("returns 400 when the assignment ID is invalid", async () => {
    const response = await GET(
      new Request("http://localhost/api/assignments/invalid-id"),
      createContext("invalid-id"),
    );

    expect(response.status).toBe(400);
    expect(findById).not.toHaveBeenCalled();
  });

  it("returns 404 when the assignment does not belong to the student or does not exist", async () => {
    findById.mockResolvedValue(null);

    const response = await GET(
      new Request("http://localhost/api/assignments/" + assignmentId),
      createContext(assignmentId),
    );

    expect(response.status).toBe(404);
  });

  it("returns 500 when assignment retrieval fails", async () => {
    findById.mockRejectedValue(new Error("Database error"));

    const response = await GET(
      new Request("http://localhost/api/assignments/" + assignmentId),
      createContext(assignmentId),
    );

    expect(response.status).toBe(500);
  });
});
