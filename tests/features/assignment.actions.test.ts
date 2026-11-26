import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  removeAssignment,
  storeAssignment,
  updateAssignment,
} from "@/actions/assignment.actions";
import { getAuthStudent } from "@/domains/student.domain";
import { createAssignmentModel } from "@/models/assignment.model";
import { database } from "@/services/database.service";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/domains/student.domain", () => ({
  getAuthStudent: vi.fn(),
}));

vi.mock("@/models/assignment.model", () => ({
  createAssignmentModel: vi.fn(),
}));

vi.mock("@/services/database.service", () => ({
  database: vi.fn(),
}));

const studentId = "00000000-0000-4000-8000-000000000001";
const assignmentId = "00000000-0000-4000-8000-000000000002";

const assignment = {
  id: assignmentId,
  studentId,
  title: "Complete WDD430 project",
  description: "Finish the assignment API",
  course: "WDD430",
  dueAt: new Date("2026-12-01T12:00:00.000Z"),
  status: "pending" as const,
  createdAt: new Date("2026-11-26T00:00:00.000Z"),
  updatedAt: new Date("2026-11-26T00:00:00.000Z"),
};

const createFormData = (values: Record<string, string>) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
};

const validFormData = () =>
  createFormData({
    title: "Complete WDD430 project",
    description: "Finish the assignment API",
    course: "WDD430",
    dueAt: "2026-12-01T12:00:00.000Z",
    status: "pending",
  });

const mockModel = {
  store: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe("Assignment Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(getAuthStudent).mockResolvedValue({
      id: studentId,
    } as Awaited<ReturnType<typeof getAuthStudent>>);

    vi.mocked(createAssignmentModel).mockReturnValue(
      mockModel as unknown as ReturnType<typeof createAssignmentModel>,
    );

    vi.mocked(database).mockReturnValue({} as ReturnType<typeof database>);

    mockModel.store.mockResolvedValue(assignment);
    mockModel.update.mockResolvedValue(assignment);
    mockModel.remove.mockResolvedValue(assignment);
  });

  describe("storeAssignment", () => {
    it("creates an assignment for the authenticated student", async () => {
      const result = await storeAssignment(validFormData());

      expect(result.success).toBe(true);
      expect(mockModel.store).toHaveBeenCalledWith(
        studentId,
        expect.objectContaining({
          title: "Complete WDD430 project",
          course: "WDD430",
        }),
      );
    });

    it("does not create an assignment when unauthenticated", async () => {
      vi.mocked(getAuthStudent).mockResolvedValue(null);

      const result = await storeAssignment(validFormData());

      expect(result.success).toBe(false);
      expect(mockModel.store).not.toHaveBeenCalled();
    });

    it("rejects invalid assignment information", async () => {
      const result = await storeAssignment(
        createFormData({ title: "", description: "", course: "" }),
      );

      expect(result.success).toBe(false);
      expect(mockModel.store).not.toHaveBeenCalled();
    });

    it("does not expose the student ID in its result", async () => {
      const result = await storeAssignment(validFormData());

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).not.toHaveProperty("studentId");
      }
    });
  });

  describe("updateAssignment", () => {
    it("updates an assignment belonging to the authenticated student", async () => {
      const formData = createFormData({ title: "Updated assignment" });

      const result = await updateAssignment(assignmentId, formData);

      expect(result.success).toBe(true);
      expect(mockModel.update).toHaveBeenCalledWith(assignmentId, studentId, {
        title: "Updated assignment",
      });
    });

    it("rejects an invalid assignment ID", async () => {
      const result = await updateAssignment("invalid-id", validFormData());

      expect(result.success).toBe(false);
      expect(mockModel.update).not.toHaveBeenCalled();
    });

    it("rejects an empty update", async () => {
      const result = await updateAssignment(assignmentId, new FormData());

      expect(result.success).toBe(false);
      expect(mockModel.update).not.toHaveBeenCalled();
    });

    it("returns not found when the assignment is not owned by the student", async () => {
      mockModel.update.mockResolvedValue(null);

      const result = await updateAssignment(
        assignmentId,
        createFormData({ title: "Updated assignment" }),
      );

      expect(result.success).toBe(false);
      expect(mockModel.update).toHaveBeenCalledWith(assignmentId, studentId, {
        title: "Updated assignment",
      });
    });
  });

  describe("removeAssignment", () => {
    it("removes an assignment belonging to the authenticated student", async () => {
      const result = await removeAssignment(assignmentId);

      expect(result.success).toBe(true);
      expect(mockModel.remove).toHaveBeenCalledWith(assignmentId, studentId);
    });

    it("rejects an invalid assignment ID", async () => {
      const result = await removeAssignment("invalid-id");

      expect(result.success).toBe(false);
      expect(mockModel.remove).not.toHaveBeenCalled();
    });

    it("returns not found when the assignment is not owned by the student", async () => {
      mockModel.remove.mockResolvedValue(null);

      const result = await removeAssignment(assignmentId);

      expect(result.success).toBe(false);
      expect(mockModel.remove).toHaveBeenCalledWith(assignmentId, studentId);
    });

    it("does not remove an assignment when unauthenticated", async () => {
      vi.mocked(getAuthStudent).mockResolvedValue(null);

      const result = await removeAssignment(assignmentId);

      expect(result.success).toBe(false);
      expect(mockModel.remove).not.toHaveBeenCalled();
    });
  });
});
