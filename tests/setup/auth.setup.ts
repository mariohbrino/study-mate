import { vi } from "vitest";

// for testing authenticated routes without requiring a real student session
vi.mock("@/domains/student.domain", () => ({
  getAuthenticatedStudent: vi.fn().mockResolvedValue({
    id: "test-student-id",
  }),
}));
