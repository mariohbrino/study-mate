# Data Model: Assignment API CRUD Endpoints

## 1. Overview

The Assignment API uses the existing Student and Assignment database models. Each assignment belongs to one student. The API must use the authenticated student's database ID when creating, retrieving, updating, or deleting assignments.

The client must never decide which student owns an assignment by sending a student ID.

## 2. Student

The Student record represents a registered Study-Mate user.

**Existing fields:**

| Field | Description |
|---|---|
| id | Unique student identifier (UUID). |
| clerkId | External authentication provider identifier. |
| timezone | Student's configured timezone. |
| createdAt | Record creation timestamp. |
| updatedAt | Last update timestamp. |

**Relationship:** One student can have many assignments.

**Authentication mapping:** The authenticated user's provider ID is used with the existing `findByClerkId()` model method to find the corresponding Student record. The authentication provider must be confirmed by the team before implementing provider-specific code.

## 3. Assignment

The Assignment record represents a task created by a student.

**Existing fields:**

| Field | Description |
|---|---|
| id | Unique assignment identifier (UUID). |
| studentId | UUID of the student who owns the assignment. |
| title | Assignment title. |
| description | Assignment description. |
| course | Course associated with the assignment. |
| dueAt | Assignment due date and time. |
| status | Assignment progress status. |
| createdAt | Record creation timestamp. |
| updatedAt | Last update timestamp. |

**Allowed status values:**

- `pending`
- `in_progress`
- `completed`

## 4. Relationship and Ownership

- Each assignment belongs to exactly one student.
- The assignment's `studentId` references the Student record's `id`.
- A student can only access assignments belonging to their own student record.
- Every item operation must include both the assignment ID and authenticated student's ID in its ownership check.
- The API must not accept `studentId` as a create or update field.
- An assignment belonging to another student must not be exposed through the API.

## 5. API Data Operations

| Operation | Existing model method | Ownership input |
|---|---|---|
| List assignments | `get(studentId)` | Authenticated student ID |
| Create assignment | `store(studentId, data)` | Authenticated student ID |
| Get assignment | `findById(id, studentId)` | Assignment ID and student ID |
| Update assignment | `update(id, studentId, data)` | Assignment ID and student ID |
| Delete assignment | `remove(id, studentId)` | Assignment ID and student ID |

## 6. Validation Rules

- Assignment IDs must be valid UUIDs.
- Titles, descriptions, and course values must follow the existing database and request validation rules.
- Status must be one of the three allowed values.
- Update requests may only change permitted assignment fields.
- Empty update requests must be rejected.
- Ownership fields and identifiers must not be changed through the request body.

## 7. Security Considerations

- Authentication must be verified on the server for every API operation.
- The authenticated identity must be mapped to an existing Student record.
- Missing student records must not result in unowned assignments being created.
- Queries and mutations must be scoped to the authenticated student's ID.
- Unauthorized access to another student's assignment should return a not-found response rather than reveal its existence.