---

description: "Task list for the Study-Mate base UI component library"
---

# Tasks: Study-Mate Base UI Component Library

**Input**: Design documents from `specs/003-base-ui-components/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Required by FR-025 through FR-027 in the feature specification and by the project constitution. Write component tests before implementation and verify they fail first.

**Organization**: Tasks are grouped by the three prioritized user stories. User Stories 1 and 2 can be implemented independently after the shared foundation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks because they affect different files and have no unfinished dependencies.
- **[Story]**: User-story label for story-phase tasks; setup, foundational, and polish tasks have no story label.
- Every task names the file or files to create, update, or validate.

## Phase 1: Setup

**Purpose**: Add the minimal component-test tooling; the project currently has no test runner.

- [X] T001 Add Vitest, React Testing Library, `@testing-library/user-event`, jsdom, and the `test:components` script in `package.json` and update `package-lock.json`.
- [X] T002 Configure Vitest to run component tests in jsdom in `vitest.config.ts` (depends on T001).

---

## Phase 2: Foundational

**Purpose**: Define shared public value types before the independently testable component groups.

- [X] T003 Define `ButtonVariant`, `ButtonSize`, and `AssignmentStatus` unions in `src/components/ui/types.ts` from the component contracts.

**Checkpoint**: T001-T003 must be complete before user-story implementation begins.

---

## Phase 3: User Story 1 - Use Consistent Actions and Forms (Priority: P1) - MVP

**Goal**: Provide reusable actions and accessible controls for assignment and account forms.

**Independent Test**: Run the Button, Input, Select, Checkbox, and Textarea tests to verify their labels, supported states, keyboard use, and error feedback without requiring a dashboard page.

### Tests for User Story 1

- [X] T004 [P] [US1] Write Button tests for all five variants, three sizes, Add/Save/Edit/Cancel/Delete labels, disabled and loading states, no repeated activation, and pointer-hover/keyboard-focus interaction states in `tests/components/ui/Button.test.tsx`; confirm tests fail before implementation.
- [X] T005 [P] [US1] Write Input tests for title, course, and search labels, required/placeholder behavior, disabled state, valid presentation without an invalid marker, and invalid feedback with associated validation errors in `tests/components/ui/Input.test.tsx`; confirm tests fail before implementation.
- [X] T006 [P] [US1] Write Select tests for Pending, In Progress, and Completed options, keyboard selection, focus, and disabled behavior in `tests/components/ui/Select.test.tsx`; confirm tests fail before implementation.
- [X] T007 [P] [US1] Write Checkbox tests for checked, unchecked, disabled, and keyboard-toggle behavior in `tests/components/ui/Checkbox.test.tsx`; confirm tests fail before implementation.
- [X] T008 [P] [US1] Write Textarea tests for its label, placeholder, disabled state, valid presentation without an invalid marker, and invalid feedback with associated validation errors in `tests/components/ui/Textarea.test.tsx`; confirm tests fail before implementation.

### Implementation for User Story 1

- [X] T009 [P] [US1] Implement the typed native Button with five variants, three sizes, visible focus, disabled state, and accessible loading behavior in `src/components/ui/Button.tsx` (depends on T004 and T003).
- [X] T010 [P] [US1] Implement the labeled native Input with semantic theme styling, stable label/error associations, and validation presentation in `src/components/ui/Input.tsx` (depends on T005 and T003).
- [X] T011 [P] [US1] Implement the labeled native Select with the three assignment status options and focus/disabled states in `src/components/ui/Select.tsx` (depends on T006 and T003).
- [X] T012 [P] [US1] Implement the labeled native Checkbox for assignment completion with checked, unchecked, disabled, and focus states in `src/components/ui/Checkbox.tsx` (depends on T007 and T003).
- [X] T013 [P] [US1] Implement the labeled native Textarea with semantic theme styling and associated validation feedback in `src/components/ui/Textarea.tsx` (depends on T008 and T003).

**Checkpoint**: User Story 1 passes its component tests and can be reused without dashboard-specific behavior.

---

## Phase 4: User Story 2 - Understand Assignment and Dashboard Information (Priority: P1)

**Goal**: Present statistics, assignments, deadlines, and activities consistently, including status and empty states.

**Independent Test**: Run Card, Badge, and List tests with representative content; verify all three status labels and populated/empty list behavior in isolation from form controls.

### Tests for User Story 2

- [X] T014 [P] [US2] Write Card tests for dashboard statistics, assignment information, and upcoming-deadline content in `tests/components/ui/Card.test.tsx`; confirm tests fail before implementation.
- [X] T015 [P] [US2] Write Badge tests for Pending, In Progress, Completed, and neutral text presentations in `tests/components/ui/Badge.test.tsx`; confirm tests fail before implementation.
- [X] T016 [P] [US2] Write List tests for populated assignment, upcoming-deadline, and recent-activity entries plus the explicit empty state in `tests/components/ui/List.test.tsx`; confirm tests fail before implementation.

### Implementation for User Story 2

- [X] T017 [P] [US2] Implement composable Card content regions for statistics, assignments, and upcoming deadlines with consistent theme-aware surface, border, padding, and spacing in `src/components/ui/Card.tsx` (depends on T014).
- [X] T018 [P] [US2] Implement typed status and neutral Badge presentations using existing semantic theme roles and readable labels in `src/components/ui/Badge.tsx` (depends on T015 and T003).
- [X] T019 [P] [US2] Implement semantic List entries and caller-provided empty-state rendering in `src/components/ui/List.tsx` (depends on T016).

**Checkpoint**: User Story 2 passes independently with its three representative card/list use cases and four badge states.

---

## Phase 5: User Story 3 - Use Familiar Components Across Screens (Priority: P2)

**Goal**: Make the eight components consistently reusable and accessible across dashboard, assignment-management, and authentication contexts.

**Independent Test**: Compose the exported primitives in representative contexts, verify automated semantic-theme/accessibility assertions, manually review both themes and narrow/wide layouts, and measure WCAG contrast for actual token pairs. The 9-of-10 unassisted student review is a post-implementation usability goal, not a release gate.

### Tests for User Story 3

- [X] T020 [US3] Write composition tests importing the public component API and exercising representative dashboard, assignment-form, and authentication-form combinations; verify semantic theme usage and accessible interaction states in `tests/components/ui/ComponentContexts.test.tsx`; confirm the missing/incomplete public contract fails before implementation.

### Implementation for User Story 3

- [X] T021 [US3] Export the eight components and public variant/status types from `src/components/ui/index.ts` (depends on T009-T019 and T020).
- [X] T022 [US3] Run automated component tests for semantic theme usage and accessible interaction states, then temporarily render representative examples in `src/app/page.tsx` and manually review hover/focus appearance, legibility in both color modes, and layout at narrow and wide viewports; remove only the temporary examples and record manual review results in `specs/003-base-ui-components/quickstart.md` (depends on T020-T021).
- [ ] T023 [US3, post-implementation goal] Conduct and record an unassisted review with 10 target-student participants; count success only when a participant identifies the primary action, assignment status, and field error, and assess whether at least 9 participants succeed; record anonymized aggregate results in `specs/003-base-ui-components/quickstart.md` (depends on T022; not a release gate).
- [X] T024 [US3] Verify actual foreground/background semantic theme-token pairs in both light and dark modes against WCAG 2.2 AA minimums (normal text 4.5:1, large text 3:1, relevant non-text controls 3:1), use compliant existing semantic pairings where needed, and record final pairs and measured ratios in `specs/003-base-ui-components/quickstart.md` (depends on T022).

**Checkpoint**: The exported library passes its automated semantic-theme/accessibility tests, manual visual review, and contrast verification without changing existing routes or workflows. The 9-of-10 unassisted usability goal is tracked separately after implementation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete component library and the implementation quickstart.

- [ ] T025 Run `npm run test:components`, `npm run lint`, `npm run format`, and `npm run typecheck` and resolve feature-related failures using `package.json` and `specs/003-base-ui-components/quickstart.md` (depends on T020-T022 and T024).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 adds test-only dependencies and the test script; T002 configures the runner and depends on T001.
- **Foundational (Phase 2)**: T003 defines shared public types after setup and blocks component implementation.
- **User Stories (Phase 3+)**: User Stories 1 and 2 both depend on Phase 2 and can then proceed in parallel.
- **User Story 3**: Depends on the component implementations in User Stories 1 and 2 because it validates the complete exported library.
- **Polish (Phase 6)**: Depends on all three user stories and the User Story 3 visual and contrast reviews. The post-implementation usability goal is not a release dependency.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after T003; independent of User Story 2.
- **User Story 2 (P1)**: Starts after T003; independent of User Story 1.
- **User Story 3 (P2)**: Starts after User Stories 1 and 2; covers complete-library composition, accessibility, and visual review.

### Within Each User Story

- Write and run the story's tests before its component implementation; confirm the new tests fail for the missing behavior first.
- Keep each component implementation and its tests in separate files so component work can be parallelized.
- Complete the story's independent test criteria before treating its checkpoint as done.
- Do not add domain persistence, route changes, global theme values, or workflows to the base primitives.

### Dependency Graph

```text
T001 -> T002 -> T003
                 | \
                 |  \-> US2 tests T014-T016 -> US2 components T017-T019
                 \----> US1 tests T004-T008 -> US1 components T009-T013
US1 + US2 -> US3 tests T020 -> public exports T021 -> visual review T022
T022 -> contrast review T024 -> Polish T025
  \-> post-implementation usability goal T023 (not a release gate)
```

### Parallel Opportunities

- After T003, all tests T004-T008 for User Story 1 can be authored in parallel; implementations T009-T013 can also run in parallel after their corresponding tests fail.
- After T003, all tests T014-T016 for User Story 2 can be authored in parallel; implementations T017-T019 can run in parallel after their corresponding tests fail.
- User Stories 1 and 2 can be assigned to different contributors after T003 because their implementation files do not overlap.
- User Story 3 starts after both component groups. Its composition tests, public barrel, manual visual review, and contrast review are release work; the usability review is tracked separately as a post-implementation goal.

## Parallel Example: User Story 1

```text
After T003, author these tests concurrently:
T004 Button.test.tsx
T005 Input.test.tsx
T006 Select.test.tsx
T007 Checkbox.test.tsx
T008 Textarea.test.tsx

After each corresponding test fails, implement in separate files:
T009 Button.tsx
T010 Input.tsx
T011 Select.tsx
T012 Checkbox.tsx
T013 Textarea.tsx
```

## Parallel Example: User Story 2

```text
After T003, author these tests concurrently:
T014 Card.test.tsx
T015 Badge.test.tsx
T016 List.test.tsx

After each corresponding test fails, implement in separate files:
T017 Card.tsx
T018 Badge.tsx
T019 List.tsx
```

## User Story 3 Execution

User Story 3 has no parallel implementation tasks: compose-test the public API
in T020, export it in T021, perform and record the manual browser review in T022,
then verify and record contrast in T024. Conduct and record the post-implementation
usability review in T023 separately; it does not block release.

## Implementation Strategy

### MVP First (User Story 1)

1. Complete test setup and shared types (Phases 1-2).
2. Complete User Story 1 tests and implementations.
3. Validate its five controls independently with `npm run test:components`.
4. Treat the controls as the first reusable increment; do not add page workflows.

### Incremental Delivery

1. Setup and shared types establish the testable public contract.
2. User Story 1 delivers actions and form controls.
3. User Story 2 independently adds dashboard cards, status badges, and lists.
4. User Story 3 verifies cross-context composition, accessibility, and visual consistency.
5. Complete visual and contrast reviews, then run the full quickstart quality
   gates. Schedule the usability goal separately after implementation.
