# Data Model: Assignment API Reads and Server Actions

## 1. Overview

The assignment feature uses the existing Student and Assignment database models. Each assignment belongs to one student.

The server must use the authenticated student's database ID when creating, retrieving, updating, or deleting assignments.

Assignment retrieval uses API Route Handlers. Assignment creation, updating, and deletion use Server Actions.

The client must never decide which student owns an assignment by sending a student ID.

## 2. Student

The Student record represents a registered Study-Mate user.

**Existing fields:**

| Field | Description |
|---|---|
| id | Unique student identifier (UUID). |
| clerkId | Unique Clerk authentication provider identifier. |
| timezone | Student's configured timezone. |
| createdAt | Record creation timestamp. |
| updatedAt | Last update timestamp. |

**Relationship:** One student can have many assignments.

**Authentication mapping:** Clerk is the selected authentication provider. The authenticated Clerk user's ID is used with the existing `findByClerkId()` model method to find the corresponding Student record.

The server must use the Student record's database `id` for all assignment ownership checks.

Clerk installation and application configuration must be verified before provider-specific implementation.

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
- A student can only access assignments belonging to their own Student record.
- Every individual assignment operation must include both the assignment ID and authenticated Student ID in its ownership check.
- The server must obtain the Student ID from the authenticated user's Student record.
- The client must not provide or modify `studentId`.
- An assignment belonging to another student must not be exposed.

## 5. Assignment Operations

| Operation | Implementation | Existing model method |
|---|---|---|
| List assignments | GET API Route Handler | `get(studentId)` |
| Retrieve one assignment | GET API Route Handler | `findById(id, studentId)` |
| Create assignment | Server Action | `store(studentId, data)` |
| Update assignment | Server Action | `update(id, studentId, data)` |
| Delete assignment | Server Action | `remove(id, studentId)` |

The existing model methods must be reused instead of duplicating database queries.

## 6. Validation Rules

- Assignment IDs must be valid UUIDs.
- Titles, descriptions, and course values must follow the existing database and request validation rules.
- Status must be one of the three allowed values.
- Create and update inputs must be validated using Zod.
- Empty update requests must be rejected.
- Update operations may only change permitted assignment fields.
- Ownership fields and protected database identifiers must not be changed through client input.

## 7. Security Considerations

- Authentication must be verified on the server for every API handler and Server Action.
- The authenticated Clerk identity must be mapped to an existing Student record.
- Missing Student records must not allow assignment operations.
- Queries and mutations must be scoped to the authenticated Student ID.
- Individual assignment operations must check ownership using both assignment ID and Student ID.
- Unauthorized access to another student's assignment should return a not-found response rather than reveal its existence.
- Internal database or authentication error details must not be exposed to clients.