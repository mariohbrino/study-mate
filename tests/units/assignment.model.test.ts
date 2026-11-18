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

  const createAssignments = async () => {
    const student = await studentModel.store({
      clerkId: "clerk-create-test",
      timezone: "Africa/Accra",
    });

    const assignment = await assignmentModel.store({
      studentId: student.id,
      title: "Assignment 1",
      description: "Description 1",
      status: "pending",
      course: "Course 1",
      dueAt: new Date(),
    });

    const assignment2 = await assignmentModel.store({
      studentId: student.id,
      title: "Assignment 2",
      description: "Description 2",
      status: "pending",
      course: "Course 1",
      dueAt: new Date(),
    });

    const assignment3 = await assignmentModel.store({
      studentId: student.id,
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

  it("should retrieve an empty list of assignments initially", async () => {
    const assignments = await assignmentModel.get();
    expect(assignments).toBeDefined();
    expect(assignments).toHaveLength(0);
  });

  it("should retrieve a list of assignments", async () => {
    const { assignment, assignment2, assignment3 } = await createAssignments();
    const assignments = await assignmentModel.get();
    expect(assignments).toBeDefined();
    expect(assignments).toHaveLength(3);
    expect(assignments[0]).toEqual(assignment);
    expect(assignments[1]).toEqual(assignment2);
    expect(assignments[2]).toEqual(assignment3);
  });

  it("should retrieve an assignment by ID", async () => {
    const { assignment } = await createAssignments();

    const found = await assignmentModel.findById(assignment!.id);
    expect(found).toBeDefined();
    expect(found).toEqual(assignment);
  });

  it("should store a new assignment", async () => {
    const { student, assignment } = await createAssignments();

    expect(assignment).toBeDefined();
    expect(assignment!.studentId).toEqual(student.id);
    expect(assignment!.title).toEqual("Assignment 1");
    expect(assignment!.description).toEqual("Description 1");
    expect(assignment!.status).toEqual("pending");
    expect(assignment!.course).toEqual("Course 1");
  });

  it("should update an existing assignment", async () => {
    const { assignment } = await createAssignments();

    const data: UpdateAssignmentInput = {
      title: "Updated Assignment",
      description: "Updated Description",
      status: "completed",
      course: "Updated Course",
      dueAt: new Date(),
    };

    const updated = await assignmentModel.update(assignment!.id, data);
    expect(updated).toBeDefined();
    expect(updated!.title).toEqual("Updated Assignment");
    expect(updated!.description).toEqual("Updated Description");
    expect(updated!.status).toEqual("completed");
    expect(updated!.course).toEqual("Updated Course");
  });

  it("should delete an existing assignment", async () => {
    const { assignment } = await createAssignments();

    const deleted = await assignmentModel.remove(assignment!.id);
    expect(deleted).toBeDefined();
    expect(deleted!.id).toEqual(assignment!.id);
  });

  it("should find an assignments by student ID", async () => {
    const { student } = await createAssignments();

    const assignments = await assignmentModel.findByStudentId(student.id);
    expect(assignments).toBeDefined();
    expect(assignments.length).toEqual(3);
    assignments.forEach((assignment) => {
      expect(assignment.studentId).toEqual(student.id);
    });
  });

  it("should return null when finding a non-existing assignment by ID", async () => {
    const found = await assignmentModel.findById(missingId);
    expect(found).toBeNull();
  });

  it("should return an empty array when student id a non-existing assignment is queried", async () => {
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
    const updated = await assignmentModel.update(missingId, data);
    expect(updated).toBeNull();
  });

  it("should return null when deleting a non-existing assignment", async () => {
    const deleted = await assignmentModel.remove(missingId);
    expect(deleted).toBeNull();
  });

  it("should throw when the ID is not a valid UUID for findById", async () => {
    await expect(assignmentModel.findById("non-valid-id")).rejects.toThrow();
  });

  it("should throw when the ID is not a valid UUID for update", async () => {
    const data: UpdateAssignmentInput = {
      title: "Invalid Update",
      description: "Invalid Update",
      status: "completed",
      course: "Invalid Update",
      dueAt: new Date(),
    };
    await expect(
      assignmentModel.update("non-valid-id", data),
    ).rejects.toThrow();
  });

  it("should throw when the ID is not a valid UUID for delete", async () => {
    await expect(assignmentModel.remove("non-valid-id")).rejects.toThrow();
  });
});
