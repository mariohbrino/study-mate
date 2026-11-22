# Feature Specification: Assignment API Reads and Server Actions

**Feature Branch**: `32-add-assignment-api-crud-endpoints`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "Allow authenticated students to create, read, update, and delete only their own assignments. Use API Route Handlers for reading assignments and Server Actions for creating, updating, and deleting assignments. Include Zod validation, authentication, authorization, appropriate error handling, and automated tests."

## User Scenarios & Testing

### User Story 1 - Create and View Assignments (Priority: P1)

As a student, I want to create assignments and view my assignment list so that I can keep track of my schoolwork and deadlines.

**Why this priority**: Creating and viewing assignments provides the main value of the assignment management feature.

**Independent Test**: An authenticated student can create an assignment through a Server Action and retrieve a list containing that assignment through the GET API without seeing assignments belonging to other students.

**Acceptance Scenarios**:

1. **Given** an authenticated student with a valid account, **When** the student submits a valid assignment through a Server Action, **Then** the assignment is saved and associated with that student's account.
2. **Given** a student with existing assignments, **When** the student requests their assignment list through `GET /api/assignments`, **Then** only assignments belonging to that student are returned.
3. **Given** an unauthenticated visitor, **When** the visitor attempts to create or retrieve assignments, **Then** access is denied.
4. **Given** an authenticated student, **When** the student submits incomplete or invalid assignment information, **Then** the Server Action returns a clear validation error.
5. **Given** an authenticated Clerk user without a matching Student record, **When** the user attempts to access assignments, **Then** the system denies access.

---

### User Story 2 - View and Update an Individual Assignment (Priority: P2)

As a student, I want to view and update one of my assignments so that I can keep its information and progress accurate.

**Why this priority**: Students need to correct assignment details and update their progress after creating assignments.

**Independent Test**: A student can retrieve an assignment through the GET API and update it through a Server Action, while attempts to access another student's assignment are denied.

**Acceptance Scenarios**:

1. **Given** an authenticated student who owns an assignment, **When** the student requests `GET /api/assignments/{id}`, **Then** its details are returned inside a `data` object without exposing `studentId`.
2. **Given** an authenticated student who owns an assignment, **When** the student submits valid changes through an update Server Action, **Then** the assignment is updated.
3. **Given** an authenticated student who does not own an assignment, **When** the student attempts to view or update it, **Then** the system denies access without exposing its private details.
4. **Given** an assignment update containing invalid information, **When** the student submits the changes, **Then** the update is rejected and the existing assignment remains unchanged.

---

### User Story 3 - Delete an Assignment (Priority: P3)

As a student, I want to delete an assignment I no longer need so that my assignment list stays useful and organized.

**Why this priority**: Deletion completes the assignment management experience, but students can still benefit from creating, viewing, and updating assignments without it.

**Independent Test**: A student can delete an assignment they own through a Server Action, and the assignment is no longer available afterward.

**Acceptance Scenarios**:

1. **Given** an authenticated student who owns an assignment, **When** the student requests its deletion through a Server Action, **Then** the assignment is removed.
2. **Given** an authenticated student who does not own an assignment, **When** the student attempts to delete it, **Then** the Server Action returns a not-found result without exposing the assignment's private details.
3. **Given** an assignment that does not exist, **When** a student attempts to delete it, **Then** the Server Action returns a clear not-found error.
4. **Given** an unauthenticated visitor, **When** the visitor attempts to delete an assignment, **Then** access is denied.

---

### Edge Cases

- A visitor attempts any assignment operation without being signed in.
- A student account is authenticated but has no matching Student record.
- A student attempts to access an assignment belonging to another student.
- A request contains missing, invalid, or incorrectly formatted assignment information.
- A request references an assignment that does not exist.
- A request contains an invalid assignment status.
- A student attempts to change the ownership of an assignment.
- A deletion or update is attempted more than once.
- The assignment service or data store is temporarily unavailable.
- A mutation succeeds but the affected assignment data is not refreshed.
- A Server Action receives invalid or unexpected input.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST require an authenticated user before allowing access to assignment information or operations.
- **FR-002**: The system MUST resolve the authenticated Clerk identity to an existing Student record.
- **FR-003**: The system MUST associate each new assignment with the authenticated Student's database ID.
- **FR-004**: Students MUST be able to create assignments using a Server Action.
- **FR-005**: Students MUST be able to retrieve a list of their own assignments through `GET /api/assignments`.
- **FR-006**: Students MUST be able to retrieve an individual assignment they own through `GET /api/assignments/{id}`.
- **FR-007**: Students MUST be able to update permitted information of an assignment they own using a Server Action.
- **FR-008**: Students MUST be able to delete assignments they own using a Server Action.
- **FR-009**: The system MUST prevent students from viewing, changing, or deleting assignments belonging to other students.
- **FR-010**: The system MUST validate assignment creation and update information using Zod schemas before saving changes.
- **FR-011**: The system MUST prevent students from changing assignment ownership through submitted information.
- **FR-012**: API handlers MUST return appropriate HTTP status codes and clear error responses for authentication failures, invalid identifiers, missing assignments, and unexpected failures.
- **FR-013**: Server Actions MUST return useful validation and operation results that the user interface can display.
- **FR-014**: The system MUST preserve existing assignment information when an update is rejected.
- **FR-015**: The system MUST support the assignment statuses pending, in progress, and completed.
- **FR-016**: The system MUST verify ownership for every operation involving an individual assignment.
- **FR-017**: Successful mutations MUST refresh or revalidate affected assignment data.
- **FR-018**: The user interface MUST provide useful validation messages, pending states, and success or error feedback for assignment mutations.
- **FR-019**: The system MUST have automated tests covering successful operations, validation failures, authentication failures, and ownership protection for API handlers and Server Actions.
- **FR-020**: The API MUST return assignment data using a consistent JSON response structure, with collection results and individual assignment results contained in a `data` property.