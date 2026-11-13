# Tasks: Study Mate Dark and Light Theme

**Input**: Design documents from `specs/002-dark-light-theme/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: No automated test tasks are included because the specification does not explicitly request TDD or new tests. Existing project quality checks and manual validation are included.

**Organization**: Tasks are grouped by user story to support independent implementation and review.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it uses a different file and has no incomplete-task dependency.
- **[Story]**: User story associated with the task.
- Every task identifies the relevant file path.

## Phase 1: Setup

**Purpose**: Review the existing project configuration before implementation.

- [x] T001 Review the existing theme definitions and Tailwind CSS configuration in `src/app/globals.css`.
- [x] T002 Review the existing font configuration and root layout in `src/app/layout.tsx`.
- [x] T003 Confirm the approved palette values and proposed missing values in `specs/002-dark-light-theme/data-model.md` and `specs/002-dark-light-theme/research.md`.

---

## Phase 2: Foundational

**Purpose**: Confirm the framework conventions required before changing shared application styling.

- [x] T004 Review the installed Next.js font and App Router documentation under `node_modules/next/dist/docs/` before modifying `src/app/layout.tsx`.
- [x] T005 Confirm the Tailwind CSS 4 theme-variable conventions used by the project before modifying `src/app/globals.css`.

**Checkpoint**: Existing project conventions and approved design values are understood.

---

## Phase 3: User Story 1 - Consistent Light and Dark Appearance (Priority: P1) - MVP

**Goal**: Provide consistent light and dark color definitions using the approved Linear-inspired palette.

**Independent Test**: Inspect the application in light and dark states and verify that the background, foreground, cards, and other semantic color roles change consistently.

### Implementation

- [x] T006 [US1] Define all seventeen light appearance color variables in `src/app/globals.css` using the approved values in `specs/002-dark-light-theme/data-model.md`.
- [x] T007 [US1] Define all seventeen dark appearance color variables under the `.dark` selector in `src/app/globals.css`.
- [x] T008 [US1] Register the seventeen semantic color roles as Tailwind CSS 4 theme variables in `src/app/globals.css`.
- [x] T009 [US1] Ensure the theme definitions use shared semantic variables rather than introducing unrelated hard-coded theme colors in `src/app/globals.css`.
- [x] T010 [US1] Configure the Tailwind CSS 4 dark variant to respond to the `.dark` class in `src/app/globals.css`.
- [x] T011 [US1] Review the existing hard-coded colors and dark-mode utilities in `src/app/page.tsx` against the semantic theme roles.
- [x] T012 [US1] Replace starter-page color styling with appropriate semantic theme utilities in `src/app/page.tsx`, preserving existing page content and functionality.

**Checkpoint**: Both appearance definitions exist, all seventeen semantic roles are available, and the existing homepage uses the semantic theme colors.

---

## Phase 4: User Story 2 - Readable Interface Elements (Priority: P2)

**Goal**: Ensure text, cards, buttons, borders, form fields, and important interface elements remain distinguishable in both appearances.

**Independent Test**: Review the foreground and background combinations for all five foreground pairing roles and inspect the application in both appearance states.

### Implementation

- [x] T013 [US2] Complete the contrast review of `card-foreground`, `primary-foreground`, `secondary-foreground`, `accent-foreground`, and `destructive-foreground` against their corresponding backgrounds in both themes in `src/app/globals.css`.
- [x] T014 [US2] Adjust the light-theme `primary-foreground` and `muted-foreground` values in `src/app/globals.css` after identifying contrast issues.
- [x] T015 [US2] Verify that background, foreground, muted, border, input, ring, and destructive roles remain distinguishable in both appearances in `src/app/globals.css`.
- [x] T016 [US2] Document all final changes to proposed palette values in `specs/002-dark-light-theme/data-model.md` and `specs/002-dark-light-theme/research.md`.

### Contrast review results

The following text pairings were reviewed against the WCAG AA normal-text target of 4.5:1.

| Text combination | Light | Dark |
|---|---:|---:|
| Foreground / Background | 16.65:1 | 14.95:1 |
| Card foreground / Card | 17.22:1 | 13.96:1 |
| Primary foreground / Primary | 4.81:1 | 15.24:1 |
| Secondary foreground / Secondary | 16.65:1 | 5.76:1 |
| Muted foreground / Muted | 4.58:1 | 7.21:1 |
| Accent foreground / Accent | 15.38:1 | 9.53:1 |
| Destructive foreground / Destructive | 4.98:1 | 6.27:1 |

The interface boundary and focus-indicator combinations were also reviewed against the 3:1 non-text contrast target.

| Interface combination | Light | Dark |
|---|---:|---:|
| Border / Background | 3.08:1 | 5.97:1 |
| Border / Card | 3.18:1 | 5.58:1 |
| Input / Background | 3.08:1 | 5.97:1 |
| Ring / Background | 4.97:1 | 5.76:1 |
| Ring / Card | 5.14:1 | 5.39:1 |

**Checkpoint**: The five foreground pairings and other important interface roles have been reviewed in both appearances.

---

## Phase 5: User Story 3 - Consistent Typography (Priority: P3)

**Goal**: Configure Inter as the primary application typeface and JetBrains Mono for code and technical text.

**Independent Test**: Inspect headings, paragraphs, navigation, buttons, and technical text to verify that the correct typefaces are available and applied.

### Implementation

- [x] T017 [P] [US3] Replace the existing Geist font configuration with Inter and JetBrains Mono using the installed Next.js font support in `src/app/layout.tsx`.
- [x] T018 [US3] Connect the Inter and JetBrains Mono font variables to the Tailwind CSS 4 font theme variables in `src/app/globals.css`.
- [x] T019 [US3] Apply the primary font consistently to the application body through `src/app/layout.tsx` and `src/app/globals.css`.

**Checkpoint**: Inter is the primary application font, and JetBrains Mono is available for technical text.

---

## Phase 6: Polish and Cross-Cutting Validation

**Purpose**: Validate the complete theme implementation and preserve existing functionality.

- [x] T020 Run `npm run lint` and resolve any relevant issues in the modified source files.
- [x] T021 Run Prettier on the four feature files and verify their formatting.
- [x] T022 Run `npm run typecheck` and resolve TypeScript errors. Existing dependencies were restored with `npm install`.
- [x] T023 Run `npm run build` and confirm that the application builds successfully.
- [x] T024 Follow `specs/002-dark-light-theme/quickstart.md` to inspect both appearance states and the configured fonts.
- [x] T025 Review the application source changes in the Git diff and confirm that the theme and typography changes are consistent with the approved scope.

**Final documentation review**: The new specification files under `specs/002-dark-light-theme/` should receive a final review before the branch is submitted for team review.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; review can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks implementation.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because it reviews the implemented color definitions.
- **User Story 3 (Phase 5)**: Depends on Foundational completion. Its layout-file work can proceed alongside User Story 1 if the team coordinates the shared stylesheet changes.
- **Polish (Phase 6)**: Depends on all three user stories being completed.

### User Story Dependencies

- **US1 (P1)**: First implementation priority; no dependency on another user story.
- **US2 (P2)**: Depends on US1's color definitions.
- **US3 (P3)**: Can proceed after foundational work, independently of US2.

### Parallel Opportunities

- T001, T002, and T003 can be reviewed independently.
- T004 and T005 can be reviewed independently.
- T017 can be performed alongside US1's stylesheet work because it modifies `src/app/layout.tsx`, while US1 modifies `src/app/globals.css`.
- Coordinate T018 and T019 with other stylesheet changes because they also involve shared styling.
- Documentation updates can be coordinated with implementation tasks, but avoid simultaneous edits to the same file.

---

## Parallel Example: User Story 1 and User Story 3

```text
Developer A:

T006-T012: Implement the color schema, dark variant, and homepage styling.

Developer B:

T017: Configure Inter and JetBrains Mono in src/app/layout.tsx.

Coordinate T018 with Developer A because it also modifies globals.css.
```

---

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Implement User Story 1.
3. Inspect both appearance states.
4. Validate the color schema before proceeding.

### Incremental Delivery

1. Complete US1: Light and dark color definitions.
2. Complete US2: Readability and contrast review.
3. Complete US3: Global typography.
4. Run all project quality checks.
5. Submit the focused feature branch for team review.

### Scope Restrictions

- Do not add a theme switcher.
- Do not add preference persistence.
- Do not install `next-themes` without team approval.
- Do not introduce unrelated application features.
- Preserve existing application functionality.

## Notes

- All seventeen semantic color roles must have light and dark values.
- Proposed palette values must remain documented as proposed values.
- Review contrast rather than assuming that every proposed pairing already passes.
- Keep the implementation within the existing Next.js App Router architecture.
- Follow the project constitution and pull request workflow.
- Implementation may proceed based on Mario's approval of the proposal in Issue #7.
- The production build, ESLint, TypeScript, and targeted Prettier checks have passed.
- The full repository Prettier check still reports formatting issues in unrelated files.
- The application source diff has been reviewed; the specification documentation should receive a final check before submitting the branch for team review.