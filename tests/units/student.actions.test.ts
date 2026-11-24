import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import {
  removeStudent,
  storeStudent,
  updateStudent,
} from "@/actions/student.actions";
import { database } from "@/services/database.service";

const createStudentFormData = (clerkId: string): FormData => {
  const formData = new FormData();
  formData.set("clerkId", clerkId);
  formData.set("timezone", "UTC");
  return formData;
};

describe("student server actions", () => {
  let client: ReturnType<typeof database>;

  beforeAll(() => {
    client = database();
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("creates a student from valid form data", async () => {
    const formData = createStudentFormData("clerk-action-create");
    formData.set("timezone", "America/Sao_Paulo");

    const result = await storeStudent(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.clerkId).toBe("clerk-action-create");
      expect(result.data.timezone).toBe("America/Sao_Paulo");
    }
  });

  it("rejects an empty Clerk ID", async () => {
    const formData = createStudentFormData("");
    const result = await storeStudent(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toContain("Clerk ID is required.");
    }
  });

  it("rejects an empty timezone", async () => {
    const formData = createStudentFormData("clerk-action-missing-timezone");
    formData.set("timezone", "");

    const result = await storeStudent(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toContain("Timezone is required.");
    }
  });

  it("updates a student's timezone", async () => {
    const created = await storeStudent(
      createStudentFormData("clerk-action-update"),
    );

    expect(created.success).toBe(true);
    if (!created.success) return;

    const formData = new FormData();
    formData.set("timezone", "America/Sao_Paulo");

    const result = await updateStudent({ id: created.data.id }, formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timezone).toBe("America/Sao_Paulo");
    }
  });

  it("rejects an invalid ID when updating", async () => {
    const formData = new FormData();
    formData.set("timezone", "UTC");

    const result = await updateStudent({ id: "invalid-id" }, formData);

    expect(result).toEqual({
      success: false,
      error: "Invalid student ID.",
    });
  });

  it("rejects invalid update form data", async () => {
    const created = await storeStudent(
      createStudentFormData("clerk-action-invalid-update"),
    );

    expect(created.success).toBe(true);
    if (!created.success) return;

    const formData = new FormData();
    formData.set("timezone", "");

    const result = await updateStudent({ id: created.data.id }, formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toContain("Timezone is required.");
    }
  });

  it("returns not found when updating a missing student", async () => {
    const formData = new FormData();
    formData.set("timezone", "UTC");

    const result = await updateStudent(
      { id: "00000000-0000-4000-8000-000000000000" },
      formData,
    );

    expect(result).toEqual({
      success: false,
      error: "Student not found.",
    });
  });

  it("removes an existing student", async () => {
    const created = await storeStudent(
      createStudentFormData("clerk-action-remove"),
    );

    expect(created.success).toBe(true);
    if (!created.success) return;

    const result = await removeStudent({ id: created.data.id });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(created.data.id);
    }
  });

  it("rejects an invalid ID when removing a student", async () => {
    const result = await removeStudent({ id: "invalid-id" });

    expect(result).toEqual({
      success: false,
      error: "Invalid student ID.",
    });
  });

  it("returns a not found error when removing a missing student", async () => {
    const result = await removeStudent({
      id: "00000000-0000-4000-8000-000000000000",
    });

    expect(result).toEqual({
      success: false,
      error: "Student not found.",
    });
  });
});
