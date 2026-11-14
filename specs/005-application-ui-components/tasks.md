---
description: "Task list for Study-Mate application-level components"
---

# Tasks: Study-Mate Application-Level Components

**Input**: Design documents from `specs/005-application-ui-components/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-components.md`, and `quickstart.md`

**Tests**: Automated component tests are included because the constitution requires tests for interactive components and the feature specification defines independent observable tests.

**Organization**: Tasks are grouped by user story and ordered by priority. P1 stories are US1, US2, and US4; P2 is US3.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Tasks touch different files and can run in parallel without incomplete prerequisites.
- **[Story]**: User-story label for story-specific work.
- Every task includes its target file path.

## Phase 1: Setup

**Purpose**: Make the existing component test runner discover the new feature tests.

- [ ] T001 [P] Update `vitest.config.ts` so `include` discovers both `*.test.ts` and `*.test.tsx` files throughout `tests/components/` while preserving the existing jsdom environment, alias, and worker settings; exclude `tests/e2e/`.

---

## Phase 2: Foundational

**Purpose**: Establish shared assignment types required by the assignment-focused stories.

- [ ] T002 [P] Define `Assignment` and `AssignmentFormValues` in `src/components/assignments/types.ts`, importing `AssignmentStatus` from `src/components/ui/types.ts`; preserve the data-model constraints: trimmed non-empty title with a 255-character maximum; optional course and description with 255-character maxima; valid required deadline; existing status union; empty strings for absent form values; Pending create default and current-value edit prefill. Document, without changing the schema, that the owning persistence flow maps omitted or whitespace-only course and description to `""` in existing non-null columns and maps empty stored strings back to `undefined`.

**Checkpoint**: T001 must be complete before running feature tests. T002 blocks US2, US3, and US4; US1 does not depend on assignment types.

---

## Phase 3: User Story 1 - Navigate Study-Mate (Priority: P1) — MVP

**Goal**: Provide a reusable, responsive, accessible Header that takes over the existing application shell navigation.

**Independent Test**: Review the configured destinations, current-page semantics, keyboard focus, and narrow-screen menu; selecting a destination closes the menu.

### Tests for User Story 1

- [ ] T003 [P] [US1] Add user-visible Header tests for configured links, `aria-current`, keyboard reachability, narrow-screen menu expanded/collapsed state, and close-on-navigation in `tests/components/application/Header.test.tsx`.

### Implementation for User Story 1

- [ ] T004 [US1] Implement `src/components/Header.tsx` by preserving the existing navigation destinations and active-route behavior, adding the accessible responsive menu, and replacing hardcoded palette classes with existing semantic theme utilities.
- [ ] T005 [US1] Update `src/app/layout.tsx` to render Header in the existing shell and remove the superseded `src/components/Navigation.tsx` so the application does not render duplicate navigation.

**Checkpoint**: User Story 1 is independently testable in the existing root layout without adding routes.

---

## Phase 4: User Story 2 - Review Assignment Workload (Priority: P1)

**Goal**: Present assignment details, urgency, optional page-supplied actions, and clear list states.

**Independent Test**: Render assignments with varied courses, deadlines, and statuses; verify soonest-deadline-first order, card content, overdue/due-soon text, supplied actions, and loading/error/empty/no-results/populated states.

### Tests for User Story 2

- [ ] T006 [P] [US2] Add AssignmentCard tests for title, deadline, status, optional course/description, readable overdue and within-48-hours text for non-completed assignments, no urgency for completed assignments, supplied actions, and absent actions in `tests/components/assignments/AssignmentCard.test.tsx`.
- [ ] T007 [P] [US2] Add AssignmentList tests for deadline ordering, stable ordering of equal deadlines, and distinct loading, error, empty, no-results, and populated states in `tests/components/assignments/AssignmentList.test.tsx`.

### Implementation for User Story 2

- [ ] T008 [US2] Implement `src/components/assignments/AssignmentCard.tsx` using the existing Card and Badge primitives; render optional page-provided action content only when supplied, and state overdue/due-within-48-hours conditions in text only for non-completed assignments.
- [ ] T009 [US2] Implement `src/components/assignments/AssignmentList.tsx` using the existing List primitive and AssignmentCard; sort the complete received collection by ascending deadline with stable source order for ties, and render loading, failure, no assignments, no search matches, and populated states distinctly. The later US3 task adds local query/page state and filtering/slicing.

**Checkpoint**: User Story 2 is independently testable using assignment fixtures and does not add persistence or mutation behavior.

---

## Phase 5: User Story 4 - Create or Edit an Assignment (Priority: P1)

**Goal**: Provide an accessible form for creating or editing assignment values without owning persistence.

**Independent Test**: Exercise create and edit modes with valid and invalid values; verify Pending default, prefilled values, field-specific errors, retained input, cancellation, and duplicate-submit prevention while pending.

### Tests for User Story 4

- [ ] T010 [P] [US4] Add AssignmentForm tests that verify title, course, and description each accept exactly 255 characters and reject 256 characters with a field-associated error while retaining the entered value; also test required title/deadline, invalid deadline, optional course/description, status selection, Pending create default, edit prefill, cancel, pending state, and duplicate-submit prevention in `tests/components/assignments/AssignmentForm.test.tsx`.

### Implementation for User Story 4

- [ ] T011 [US4] Implement `src/components/assignments/AssignmentForm.tsx` with the existing Input, Textarea, Select, and Button primitives; require a trimmed non-empty title and valid deadline, enforce a maximum of 255 characters independently for title, course, and description, and show a field-associated error while retaining each over-limit value. Keep course and description optional, default create status to `pending`, prefill edit values, preserve values after validation errors, and disable repeated submission while pending.

**Checkpoint**: User Story 4 is independently testable through its submit/cancel contract; persistence remains with the owning application flow.

---

## Phase 6: User Story 3 - Find and Navigate Assignment Results (Priority: P2)

**Goal**: Provide reusable controlled search and pagination controls composed by AssignmentList, which owns filtering and page-slice behavior.

**Independent Test**: Provide AssignmentList with a complete collection and page size; verify case-insensitive matches, stable deadline ordering, correct page slices, query reset/retention, page clamping, first/last boundaries, and omitted controls for zero or one page.

### Tests for User Story 3

- [ ] T012 [P] [US3] Add AssignmentSearch tests for its accessible label, controlled query-change behavior, clear action, and empty-query state in `tests/components/assignments/AssignmentSearch.test.tsx`.
- [ ] T013 [P] [US3] Add Pagination tests for current-page announcement, previous/next and page-selection behavior, first/last boundaries, and omitted controls when `pageCount` is zero or one in `tests/components/assignments/Pagination.test.tsx`.

### Implementation for User Story 3

- [ ] T014 [P] [US3] Implement `src/components/assignments/AssignmentSearch.tsx` as a controlled, accessible search input using the existing Input and Button primitives; emit query changes and clear requests without fetching or persisting results.
- [ ] T015 [P] [US3] Implement `src/components/assignments/Pagination.tsx` as a controlled component using the existing Button primitive; announce the current page, omit controls for zero or one page, and never emit a page change outside `1..pageCount`.
- [ ] T016 [P] [US3] Add automated tests in `tests/components/assignments/assignment-results.test.ts` and `tests/components/assignments/AssignmentList.test.tsx` for case-insensitive filtering, stable deadline ordering, page slicing, resetting to page one after a query change, retaining the query while changing pages, and clamping the page when results shrink.
- [ ] T017 [US3] Implement pure result operations in `src/components/assignments/assignment-results.ts` and update `src/components/assignments/AssignmentList.tsx` to receive the complete collection and page size, own local query/current-page state, compose controlled AssignmentSearch and Pagination, use the helper for filtering/sorting/page slicing, reset to page one on query change, retain the query when paging, and clamp the page when the collection shrinks.

**Checkpoint**: User Story 3 provides controlled Search and Pagination children; AssignmentList owns case-insensitive filtering, stable deadline sorting, page slicing, query retention/reset, and current-page clamping. The follow-on Assignment Page Integration feature supplies the complete collection and page size.

---

## Phase 7: Polish and Cross-Cutting Validation

**Purpose**: Verify theme, responsive, accessibility, integration, and usability requirements across the completed components.

- [ ] T018 Add `@playwright/test` as a test-only development dependency in `package.json`, add the `test:e2e` script, and configure `playwright.config.ts` to run the existing root route with `STUDY_MATE_E2E=1` and the installed Chromium browser; justify Playwright because the constitution requires browser E2E coverage and the repository has no existing browser automation tool. Do not add a runtime dependency.
- [ ] T019 Add browser-flow tests in `tests/e2e/assignment-flows.spec.ts` for creating and editing an assignment, marking it completed, and viewing upcoming deadlines with readable status through the existing `/` route; assert that tests use the in-memory fixture and do not write to the database.
- [ ] T020 Implement `src/components/assignments/AssignmentE2EFixture.tsx` using the real assignment components and gate its rendering from `src/app/page.tsx` on `STUDY_MATE_E2E=1`; provide in-memory create/edit/complete behavior and upcoming-deadline/status presentation, with normal root rendering unchanged when test mode is off.
- [ ] T021 Perform and record the manual browser review in `specs/005-application-ui-components/quickstart.md`: inspect all six components at 320px and 1440px in light and dark modes; manually review pointer hover, keyboard focus, legibility, no horizontal overflow, form/list states, and search/pagination boundaries. Verify the in-memory fixture is visible only with `STUDY_MATE_E2E=1` and the ordinary root page remains unchanged without it.
- [ ] T022 Run `npm run lint`, `npm run format`, `npm run typecheck`, `npm run test:components`, and `npm run test:e2e` from `specs/005-application-ui-components/quickstart.md`; resolve feature-related failures and record the outcomes in that guide.
- [ ] T023 After the follow-on Assignment Page Integration feature provides `/assignments`, conduct the post-integration usability review with 10 target students and record the participant count and successful completions in `specs/005-application-ui-components/quickstart.md`; the goal is at least 9 of 10, without assistance, navigating to assignments, finding the specified assignment, and identifying how to create or edit an assignment. This is not a release gate for the reusable component library.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 updates Vitest discovery.
- **Foundational (Phase 2)**: T002 defines shared assignment types; it can run in parallel with T001.
- **User Stories (Phase 3+)**: All depend on T001 for component-test discovery. US2, US3, and US4 also depend on T002; US1 is independent of T002.
- **E2E and Polish (Phase 7)**: T018 depends on T001; T019 depends on T018; T020 follows the E2E tests. T021 and T022 depend on all in-scope component work and T018-T020. T023 is post-integration and depends on the follow-on Assignment Page Integration feature, not on this feature's release.

### User Story Dependencies

- **US1 (P1)**: Depends on T001 only. Independent of assignment stories.
- **US2 (P1)**: Depends on T001 and T002. Independent of US1 and US4.
- **US4 (P1)**: Depends on T001 and T002. Independent of US1 and US2.
- **US3 (P2)**: Depends on T001 and T002, plus the AssignmentList presentation from T009. Search and Pagination controls can be implemented independently; result-state integration follows T014, T015, and T019.

### Within Each User Story

- Write and run the story's tests before its implementation tasks.
- T005 follows T004 because the root layout must import the implemented Header.
- T009 follows T008 because AssignmentList renders AssignmentCard.
- Story implementations can proceed in parallel after their listed prerequisites; keep edits to shared files sequential.

### Parallel Opportunities

- T001 and T002 can run in parallel because they update different files.
- After shared prerequisites, US1 Header work, US2 assignment presentation, and US4 form work can proceed independently. US3's controlled Search/Pagination work can proceed in parallel, but AssignmentList result-state integration depends on T009.
- Within US2, T006 and T007 are parallel test tasks; implement AssignmentCard before AssignmentList.
- Within US3, T012 and T013 are parallel tests; T014 and T015 are independent controlled-component implementations. T016 tests the result helper and AssignmentList behavior before T017 integrates that behavior.

---

## Parallel Example: User Story 2

```text
Task: "Add AssignmentCard tests in tests/components/assignments/AssignmentCard.test.tsx"
Task: "Add AssignmentList tests in tests/components/assignments/AssignmentList.test.tsx"
```

## Parallel Example: User Story 3

```text
Task: "Add AssignmentSearch tests in tests/components/assignments/AssignmentSearch.test.tsx"
Task: "Add Pagination tests in tests/components/assignments/Pagination.test.tsx"
Task: "Add AssignmentList search and page-slice tests in tests/components/assignments/AssignmentList.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete test discovery and shared type setup.
2. Implement and independently validate the responsive Header in the existing shell.
3. Stop for review; do not add routes or assignment persistence as part of the MVP.

### Incremental Delivery

1. Complete US1 for a usable shared application shell.
2. Add US2 assignment presentation and independently validate it with fixtures.
3. Add US4 form behavior and independently validate create/edit states.
4. Add US3 controlled search and pagination.
5. Add the test-only Playwright setup, in-memory fixture, and critical-flow tests.
6. Complete cross-cutting browser and automated validation; run the post-integration usability goal when Assignment Page Integration is available.

### Notes

- `[P]` means different files and no incomplete prerequisites.
- Story labels map to the four user stories in `spec.md`.
- Reuse base components and existing status types; add only the justified test-only Playwright dependency, not a runtime dependency.
- Do not add product routes, database persistence, or schema changes. The follow-on Assignment Page Integration feature owns the actual assignments page and server data flow; AssignmentList owns local filtering/pagination state within this component feature.
