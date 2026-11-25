import { vi } from "vitest";

// for testing authenticated routes without requiring a real student session
vi.mock("@/domains/student.domain", () => ({
  getAuthStudent: vi.fn().mockResolvedValue({
    id: "00000000-0000-4000-8000-000000000000",
  }),
}));
