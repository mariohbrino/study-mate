# Tasks: Assignment API CRUD Endpoints

**Input**: Design documents from `specs/006-assignment-api-crud-endpoints/`

**Prerequisites**: Approved `spec.md`, `plan.md`, `research.md`, `data-model.md`, and `contracts/assignments-api.md`.

**Tests**: Required by FR-015 and the Study-Mate Constitution. Follow a test-first approach.

## Phase 1: Setup

**Purpose**: Confirm project decisions and prepare the feature for implementation.

- [ ] T001 Obtain team approval for `specs/006-assignment-api-crud-endpoints/spec.md` and update its status after approval.
- [ ] T002 Confirm the authentication provider with Mario and document the decision in `specs/006-assignment-api-crud-endpoints/research.md`.
- [ ] T003 Verify the approved authentication dependency and required environment configuration in `package.json` and `.env.example`.

## Phase 2: Foundational

**Purpose**: Establish shared authentication and validation infrastructure required by all user stories.

- [ ] T004 Implement a server-side authenticated student resolver using the approved provider in `src/services/assignment-auth.service.ts`; map the authenticated identity to a Student using `findByClerkId()`.
- [ ] T005 [P] Add authentication resolver tests for authenticated users, unauthenticated users, and missing student records in `tests/units/assignment-auth.service.test.ts`.
- [ ] T006 Create shared assignment request validation schemas for create and update operations in `src/schemas/assignments.schema.ts`.
- [ ] T007 [P] Add validation tests for required fields, permitted update fields, invalid status values, and empty update requests in `tests/units/assignments.schema.test.ts`.

**Checkpoint**: Authentication resolution and request validation are ready. Do not proceed with provider-specific implementation until the team confirms the provider.

## Phase 3: User Story 1 - Create and View Assignments (Priority: P1)

**Goal**: Allow authenticated students to create assignments and list only their own assignments.

**Independent Test**: An authenticated student can create an assignment and retrieve it from their list without seeing another student's assignments.

### Tests for User Story 1

- [ ] T008 [P] [US1] Add tests for assignment collection GET and POST, including authentication, validation, and student ownership, in `tests/units/assignment-collection-api.test.ts`.

### Implementation for User Story 1

- [ ] T009 [US1] Implement collection GET in `src/app/api/assignments/route.ts` using the authenticated student's ID and existing assignment model.
- [ ] T010 [US1] Implement collection POST in `src/app/api/assignments/route.ts` using the create validation schema and `assignmentModel.store()`.
- [ ] T011 [US1] Return the documented JSON response structure without exposing `studentId` in `src/app/api/assignments/route.ts`.
- [ ] T012 [US1] Implement appropriate 200, 201, 400, 401, 404, and 500 responses for collection operations in `src/app/api/assignments/route.ts`.

**Checkpoint**: User Story 1 must pass its tests independently.

## Phase 4: User Story 2 - View and Update an Individual Assignment (Priority: P2)

**Goal**: Allow authenticated students to retrieve and update individual assignments they own.

**Independent Test**: A student can retrieve and update their own assignment, while another student's assignment remains inaccessible.

### Tests for User Story 2

- [ ] T013 [P] [US2] Add tests for individual assignment GET and PATCH, including invalid UUIDs, ownership protection, invalid updates, and missing assignments, in `tests/units/assignment-item-api.test.ts`.

### Implementation for User Story 2

- [ ] T014 [US2] Implement individual assignment GET in `src/app/api/assignments/[id]/route.ts` using `assignmentModel.findById()` with the authenticated student's ID.
- [ ] T015 [US2] Implement individual assignment PATCH in `src/app/api/assignments/[id]/route.ts` using the update validation schema and `assignmentModel.update()`.
- [ ] T016 [US2] Validate assignment UUIDs and prevent changes to `id` or `studentId` in `src/app/api/assignments/[id]/route.ts`.
- [ ] T017 [US2] Return the documented response structure and appropriate 200, 400, 401, 404, and 500 responses for individual GET and PATCH operations in `src/app/api/assignments/[id]/route.ts`.

**Checkpoint**: User Stories 1 and 2 must both pass their tests.

## Phase 5: User Story 3 - Delete an Assignment (Priority: P3)

**Goal**: Allow authenticated students to delete assignments they own.

**Independent Test**: A student can delete their own assignment, and another student cannot delete it.

### Tests for User Story 3

- [ ] T018 [P] [US3] Add tests for assignment deletion, including successful deletion, unauthenticated requests, missing assignments, and cross-student deletion attempts, in `tests/units/assignment-delete-api.test.ts`.

### Implementation for User Story 3

- [ ] T019 [US3] Implement individual assignment DELETE in `src/app/api/assignments/[id]/route.ts` using `assignmentModel.remove()` with the authenticated student's ID.
- [ ] T020 [US3] Return 204 No Content after successful deletion and appropriate 400, 401, 404, and 500 responses for deletion failures in `src/app/api/assignments/[id]/route.ts`.

**Checkpoint**: All three user stories must pass their tests.

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Verify security, quality, and documentation across all API operations.

- [ ] T021 [P] Review authentication and ownership checks across `src/app/api/assignments/route.ts` and `src/app/api/assignments/[id]/route.ts`.
- [ ] T022 [P] Verify API response documentation matches the implementation in `specs/006-assignment-api-crud-endpoints/contracts/assignments-api.md`.
- [ ] T023 Run the complete automated test suite and resolve failures using `npm run test`.
- [ ] T024 Run TypeScript checks and resolve errors using `npm run typecheck`.
- [ ] T025 Run lint checks and resolve errors using `npm run lint`.
- [ ] T026 Run formatting checks and resolve issues using `npm run format`.
- [ ] T027 Verify the implementation steps and test scenarios documented in `specs/006-assignment-api-crud-endpoints/quickstart.md`.

## Dependencies and Execution Order

### Phase Dependencies

- Phase 1 must be completed before implementation, including feature approval and authentication-provider confirmation.
- Phase 2 establishes the shared authentication and validation foundation.
- Phase 3 delivers the P1 MVP.
- Phase 4 delivers individual assignment retrieval and updates.
- Phase 5 completes assignment CRUD functionality.
- Phase 6 verifies quality and security before the pull request.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2.
- **US2 (P2)**: Depends on Phase 2 and uses the same authentication and validation foundation.
- **US3 (P3)**: Depends on Phase 2 and uses the individual assignment route created for US2.

Because US2 and US3 modify the same route file, implement them sequentially to avoid file conflicts.

## Parallel Opportunities

- T005 and T007 can be worked on in parallel because they use separate test files.
- T008 can be prepared independently after the shared foundation is available.
- T013 and T018 use separate test files and can be prepared independently.
- T021 and T022 can be reviewed independently.
- Avoid parallel implementation tasks that modify the same route file.

## Implementation Strategy

### MVP First

1. Complete Phase 1 and obtain the required approvals.
2. Complete Phase 2.
3. Implement and test US1.
4. Validate that authenticated students can create and list their own assignments.

### Incremental Delivery

1. Add US2 for retrieving and updating individual assignments.
2. Add US3 for deleting assignments.
3. Run all tests and quality checks.
4. Submit the feature through a reviewed pull request.

## Notes

- All tasks use sequential IDs.
- `[P]` identifies tasks that can be performed in parallel.
- `[US1]`, `[US2]`, and `[US3]` identify the user story associated with each task.
- All assignment operations must use the authenticated student's database ID.
- Never trust client-supplied ownership information.
- Do not expose internal database errors or stack traces.
- Keep the authentication provider decision documented and approved by the team.