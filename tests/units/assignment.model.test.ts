import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createAssignmentModel } from "@/models/assignment.model";
import { createStudentModel } from "@/models/student.model";
import { database } from "@/services/database.service";
import type { UpdateAssignmentInput } from "@/types/assignment.type";
import type { Database } from "@/types/database.type";

describe("assignment model unit tests", () => {
  const missingId = "00000000-0000-0000-0000-000000000000";

  let client: Database;
  let assignmentModel: ReturnType<typeof createAssignmentModel>;
  let studentModel: ReturnType<typeof createStudentModel>;

  const createStudent = async (clerkId: string) => {
    return studentModel.store({
      clerkId,
      timezone: "Africa/Accra",
    });
  };

  const createAssignments = async () => {
    const student = await createStudent("clerk-create-test");

    const assignment = await assignmentModel.store(student.id, {
      title: "Assignment 1",
      description: "Description 1",
      status: "pending",
      course: "Course 1",
      dueAt: new Date(),
    });

    const assignment2 = await assignmentModel.store(student.id, {
      title: "Assignment 2",
      description: "Description 2",
      status: "pending",
      course: "Course 1",
      dueAt: new Date(),
    });

    const assignment3 = await assignmentModel.store(student.id, {
      title: "Assignment 3",
      description: "Description 3",
      status: "pending",
      course: "Course 1",
      dueAt: new Date(),
    });

    return { student, assignment, assignment2, assignment3 };
  };

  beforeAll(() => {
    client = database();
    assignmentModel = createAssignmentModel(client);
    studentModel = createStudentModel(client);
  });

  beforeEach(async () => {
    await client.$client.query("BEGIN");
  });

  afterEach(async () => {
    await client.$client.query("ROLLBACK");
  });

  it("should retrieve an empty list of assignments for a student", async () => {
    const student = await createStudent("clerk-empty-test");
    const assignments = await assignmentModel.get(student.id);

    expect(assignments).toHaveLength(0);
  });

  it("should retrieve only assignments belonging to a student", async () => {
    const { student, assignment, assignment2, assignment3 } =
      await createAssignments();

    const otherStudent = await createStudent("clerk-other-test");

    await assignmentModel.store(otherStudent.id, {
      title: "Other Student Assignment",
      description: "Another student's work",
      status: "pending",
      course: "Course 2",
      dueAt: new Date(),
    });

    const assignments = await assignmentModel.get(student.id);

    expect(assignments).toHaveLength(3);
    expect(assignments[0]).toEqual(assignment);
    expect(assignments[1]).toEqual(assignment2);
    expect(assignments[2]).toEqual(assignment3);
    expect(assignments.every((item) => item.studentId === student.id)).toBe(
      true,
    );
  });

  it("should retrieve an assignment by ID for its owner", async () => {
    const { student, assignment } = await createAssignments();

    const found = await assignmentModel.findById(assignment.id, student.id);

    expect(found).toEqual(assignment);
  });

  it("should store a new assignment for the specified student", async () => {
    const student = await createStudent("clerk-store-test");

    const assignment = await assignmentModel.store(student.id, {
      title: "New Assignment",
      description: "New Description",
      status: "pending",
      course: "Course 1",
      dueAt: new Date(),
    });

    expect(assignment.studentId).toBe(student.id);
    expect(assignment.title).toBe("New Assignment");
  });

  it("should update an assignment belonging to the student", async () => {
    const { student, assignment } = await createAssignments();

    const data: UpdateAssignmentInput = {
      title: "Updated Assignment",
      description: "Updated Description",
      status: "completed",
      course: "Updated Course",
      dueAt: new Date(),
    };

    const updated = await assignmentModel.update(
      assignment.id,
      student.id,
      data,
    );

    expect(updated).toBeDefined();
    expect(updated!.title).toBe("Updated Assignment");
    expect(updated!.description).toBe("Updated Description");
    expect(updated!.status).toBe("completed");
    expect(updated!.course).toBe("Updated Course");
    expect(updated!.studentId).toBe(student.id);
  });

  it("should delete an assignment belonging to the student", async () => {
    const { student, assignment } = await createAssignments();

    const deleted = await assignmentModel.remove(assignment.id, student.id);

    expect(deleted).toBeDefined();
    expect(deleted!.id).toBe(assignment.id);
  });

  it("should find assignments by student ID", async () => {
    const { student } = await createAssignments();

    const assignments = await assignmentModel.findByStudentId(student.id);

    expect(assignments).toHaveLength(3);
    assignments.forEach((assignment) => {
      expect(assignment.studentId).toBe(student.id);
    });
  });

  it("should not allow another student to retrieve an assignment", async () => {
    const { assignment } = await createAssignments();
    const otherStudent = await createStudent("clerk-unauthorized-read");

    const found = await assignmentModel.findById(
      assignment.id,
      otherStudent.id,
    );

    expect(found).toBeNull();
  });

  it("should not allow another student to update an assignment", async () => {
    const { student, assignment } = await createAssignments();
    const otherStudent = await createStudent("clerk-unauthorized-update");

    const updated = await assignmentModel.update(
      assignment.id,
      otherStudent.id,
      { title: "Unauthorized Update" },
    );

    expect(updated).toBeNull();

    const unchanged = await assignmentModel.findById(assignment.id, student.id);

    expect(unchanged!.title).toBe("Assignment 1");
  });

  it("should not allow another student to delete an assignment", async () => {
    const { student, assignment } = await createAssignments();
    const otherStudent = await createStudent("clerk-unauthorized-delete");

    const deleted = await assignmentModel.remove(
      assignment.id,
      otherStudent.id,
    );

    expect(deleted).toBeNull();

    const stillExists = await assignmentModel.findById(
      assignment.id,
      student.id,
    );

    expect(stillExists).toBeDefined();
  });

  it("should return null when finding a non-existing assignment", async () => {
    const found = await assignmentModel.findById(missingId, missingId);

    expect(found).toBeNull();
  });

  it("should return an empty array for a non-existing student ID", async () => {
    const assignments = await assignmentModel.findByStudentId(missingId);

    expect(assignments).toEqual([]);
  });

  it("should return null when updating a non-existing assignment", async () => {
    const data: UpdateAssignmentInput = {
      title: "Non-existing Update",
      description: "Non-existing Update",
      status: "completed",
      course: "Non-existing Update",
      dueAt: new Date(),
    };

    const updated = await assignmentModel.update(missingId, missingId, data);

    expect(updated).toBeNull();
  });

  it("should return null when deleting a non-existing assignment", async () => {
    const deleted = await assignmentModel.remove(missingId, missingId);

    expect(deleted).toBeNull();
  });

  it("should throw when the assignment ID is not a valid UUID for findById", async () => {
    await expect(
      assignmentModel.findById("non-valid-id", missingId),
    ).rejects.toThrow();
  });

  it("should throw when the assignment ID is not a valid UUID for update", async () => {
    await expect(
      assignmentModel.update("non-valid-id", missingId, {
        title: "Invalid Update",
      }),
    ).rejects.toThrow();
  });

  it("should throw when the assignment ID is not a valid UUID for delete", async () => {
    await expect(
      assignmentModel.remove("non-valid-id", missingId),
    ).rejects.toThrow();
  });
});
