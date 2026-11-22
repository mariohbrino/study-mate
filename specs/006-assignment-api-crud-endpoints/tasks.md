# Tasks: Assignment API Reads and Server Actions

**Input**: Design documents from `specs/006-assignment-api-crud-endpoints/`

**Prerequisites**: Approved `spec.md`, `plan.md`, `research.md`, `data-model.md`, and `contracts/assignments-api.md`.

**Tests**: Required by FR-015 and the Study-Mate Constitution. Follow a test-first approach.

## Phase 1: Setup

**Purpose**: Confirm team decisions and prepare the feature.

- [ ] T001 Confirm approval of the revised feature architecture with Mario.
- [ ] T002 Confirm the team's Clerk application and authentication configuration.
- [ ] T003 Verify the required Clerk dependency and environment variables in `package.json` and `.env.example`.
- [ ] T004 Confirm the agreed locations for Server Actions and Zod validation schemas.

## Phase 2: Foundational

**Purpose**: Establish shared authentication and validation infrastructure.

- [ ] T005 Implement a server-side authenticated student resolver in `src/services/assignment-auth.service.ts`, mapping the authenticated Clerk user to a Student using `findByClerkId()`.
- [ ] T006 [P] Add authentication resolver tests for authenticated users, unauthenticated users, and missing Student records in `tests/units/assignment-auth.service.test.ts`.
- [ ] T007 Create assignment creation and update Zod schemas in `src/schemas/assignments.schema.ts`.
- [ ] T008 [P] Add validation tests for required fields, invalid status values, permitted update fields, and empty update requests in `tests/units/assignments.schema.test.ts`.

**Checkpoint**: Authentication resolution and validation are ready before implementing protected operations.

## Phase 3: User Story 1 - Create and View Assignments (Priority: P1)

**Goal**: Allow authenticated students to create assignments and retrieve their own assignments.

**Independent Test**: An authenticated student can create an assignment through a Server Action and retrieve their assignments through the GET API.

### Tests

- [ ] T009 [P] [US1] Add tests for GET `/api/assignments`, including authentication, Student ownership, and database errors, in `tests/units/assignment-collection-api.test.ts`.
- [ ] T010 [P] [US1] Add tests for the create assignment Server Action, including validation, authentication, ownership, and successful creation, in `tests/units/assignment.actions.test.ts`.

### Implementation

- [ ] T011 [US1] Implement GET `/api/assignments` in `src/app/api/assignments/route.ts` using the authenticated Student ID and existing Assignment model.
- [ ] T012 [US1] Implement the create assignment Server Action in `src/actions/assignment.actions.ts` using the creation schema and `assignmentModel.store()`.
- [ ] T013 [US1] Ensure collection API responses do not expose unnecessary internal ownership information.
- [ ] T014 [US1] Return appropriate HTTP status codes and error responses from the collection GET handler.
- [ ] T015 [US1] Ensure the create action validates its input, verifies authentication, and uses the authenticated Student ID rather than trusting client-supplied ownership data.

**Checkpoint**: Students can list and create their own assignments, and the related tests pass.

## Phase 4: User Story 2 - View and Update an Individual Assignment (Priority: P2)

**Goal**: Allow authenticated students to retrieve and update individual assignments they own.

**Independent Test**: A student can retrieve and update their own assignment, while another student's assignment remains inaccessible.

### Tests

- [ ] T016 [P] [US2] Add tests for GET `/api/assignments/[id]`, including invalid UUIDs, missing records, authentication, ownership, and database errors, in `tests/units/assignment-item-api.test.ts`.
- [ ] T017 [US2] Add tests for the update assignment Server Action, including validation, authentication, ownership, missing records, and successful updates, in `tests/units/assignment.actions.test.ts`.

### Implementation

- [ ] T018 [US2] Implement individual assignment GET in `src/app/api/assignments/[id]/route.ts` using `assignmentModel.findById()` and the authenticated Student ID.
- [ ] T019 [US2] Implement the update assignment Server Action in `src/actions/assignment.actions.ts` using the update schema and `assignmentModel.update()`.
- [ ] T020 [US2] Validate assignment UUIDs and prevent changes to protected fields such as `id` and `studentId`.
- [ ] T021 [US2] Return appropriate HTTP status codes and error responses from the individual GET handler.
- [ ] T022 [US2] Ensure the update action verifies ownership and revalidates affected data after a successful update.

**Checkpoint**: Individual assignment retrieval and updates pass their tests.

## Phase 5: User Story 3 - Delete an Assignment (Priority: P3)

**Goal**: Allow authenticated students to delete assignments they own.

**Independent Test**: A student can delete their own assignment, but cannot delete another student's assignment.

### Tests

- [ ] T023 [US3] Add tests for the delete assignment Server Action, including successful deletion, authentication, missing records, and cross-student access attempts, in `tests/units/assignment.actions.test.ts`.

### Implementation

- [ ] T024 [US3] Implement the delete assignment Server Action in `src/actions/assignment.actions.ts` using `assignmentModel.remove()`.
- [ ] T025 [US3] Ensure the delete action verifies authentication and ownership and revalidates affected data after successful deletion.

**Checkpoint**: All assignment operations pass their tests.

## Phase 6: User Experience, Documentation, and Quality

**Purpose**: Complete user feedback, documentation, security review, and quality checks.

- [ ] T026 Add form validation messages and useful error feedback for assignment mutations.
- [ ] T027 Add pending/loading states and success feedback for assignment mutations.
- [ ] T028 [P] Document Clerk authentication, Student mapping, API read endpoints, and Server Action mutations.
- [ ] T029 [P] Review authentication and ownership checks across all API handlers and Server Actions.
- [ ] T030 Verify the API contract in `specs/006-assignment-api-crud-endpoints/contracts/assignments-api.md` matches the GET-only API implementation.
- [ ] T031 Run the complete automated test suite using `npm run test`.
- [ ] T032 Run TypeScript checks using `npm run typecheck`.
- [ ] T033 Run lint checks using `npm run lint`.
- [ ] T034 Run formatting checks using `npm run format`.
- [ ] T035 Verify implementation and test instructions in `specs/006-assignment-api-crud-endpoints/quickstart.md`.

## Dependencies and Execution Order

### Phase Dependencies

- Phase 1 confirms team decisions and project configuration.
- Phase 2 establishes shared authentication and validation.
- Phase 3 delivers assignment creation and collection retrieval.
- Phase 4 adds individual retrieval and updates.
- Phase 5 adds deletion.
- Phase 6 completes user feedback, documentation, and quality checks.

### User Story Dependencies

- **US1 (P1)** depends on Phase 2.
- **US2 (P2)** depends on Phase 2 and reuses the authentication and validation foundation.
- **US3 (P3)** depends on Phase 2 and the existing Assignment model.

### Parallel Opportunities

- T006 and T008 can be developed independently.
- T009 and T010 can be developed independently.
- T016 and T017 should not be developed in parallel because they share a test file.
- T028 and T029 can be reviewed independently.
- Avoid parallel implementation changes to the same file.

## Implementation Strategy

### MVP First

1. Confirm team approval and Clerk configuration.
2. Complete authentication and validation foundations.
3. Implement and test GET `/api/assignments`.
4. Implement and test the create assignment Server Action.

### Incremental Delivery

1. Add individual assignment retrieval.
2. Add the update Server Action.
3. Add the delete Server Action.
4. Complete user feedback and documentation.
5. Run all tests and quality checks.
6. Submit a reviewed pull request.

## Notes

- All assignment operations must use the authenticated Student's database ID.
- Never trust client-supplied ownership information.
- Reuse the existing Assignment model and its ownership-aware methods.
- API Route Handlers are used for reads; Server Actions are used for mutations.
- Do not expose internal database errors or stack traces.
- Keep Clerk configuration and team decisions documented.
- Task IDs are sequential and `[P]` identifies tasks that can be developed independently.