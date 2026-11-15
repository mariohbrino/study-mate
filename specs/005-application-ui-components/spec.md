# Feature Specification: Study-Mate Application-Level Components

**Feature Branch**: `6-design-a-base-components`

**Created**: 2026-11-14

**Status**: Draft

**Input**: User description: "Create reusable application-level components for Study Mate, including Header, AssignmentCard, AssignmentList, AssignmentForm, AssignmentSearch, and Pagination. Reuse the existing base UI components in src/components/ui/. Follow the established theme tokens, accessibility standards, responsive design conventions, and existing application architecture. Do not introduce unnecessary dependencies or duplicate existing UI primitives."

## Clarifications

### Session 2026-11-14

- Q: Should an assignment card offer optional actions such as mark complete, edit, or delete, or should those actions stay outside the card? → A: Assignment cards may show optional mark-complete, edit, or delete actions supplied by the page using the card; they do not force actions or own assignment changes.
- Q: Where should filtering, pagination slicing, and query retention live? → A: AssignmentSearch and Pagination remain reusable controlled components; AssignmentList acts as the results container and owns query/page state, case-insensitive title filtering, sorting, page slicing, resetting to page one after a query change, and retaining the query while changing pages.
- Q: Which feature owns the assignment page and its data flow? → A: A follow-on Assignment Page Integration feature owns the `/assignments` route, server data loading, and persistence/action wiring; it supplies the complete assignment collection and page size to AssignmentList.
- Q: How should critical assignment flows be tested without adding routes or persistence here? → A: Use the existing `/` route in an environment-gated Playwright test mode with an in-memory fixture; do not add a product route or database persistence.
- Q: How are omitted optional course and description values stored? → A: Map absent or whitespace-only values to `""` in the existing non-null database columns and map empty stored strings back to `undefined` for UI presentation; do not change the schema.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate Study-Mate (Priority: P1)

As a student, I want a consistent header with clear navigation so that I can move between the application's main sections from any page.

**Why this priority**: The header is the shared entry point to application sections and must work across the responsive application shell.

**Independent Test**: Review the header on multiple application sections, use each navigation destination with a pointer and keyboard, and verify the current destination and narrow-screen menu state.

**Acceptance Scenarios**:

1. **Given** a student is on an application page, **When** they view the header, **Then** the Study-Mate identity and the application's configured primary navigation destinations are visible and the current destination is identified.
2. **Given** the viewport is narrow, **When** a student opens the navigation menu, **Then** its destinations become available without horizontal overflow and the menu's expanded or collapsed state is conveyed accessibly.
3. **Given** the navigation menu is open, **When** a student selects a destination, **Then** the application opens that destination and the menu closes.
4. **Given** a student navigates with a keyboard, **When** they move through the header, **Then** every destination has visible focus and its name and current-page state are available to assistive technology.
5. **Given** a student views the header in light or dark appearance, **When** it is displayed at narrow or wide viewport sizes, **Then** its identity, navigation, and focus states remain legible without obscured content or horizontal overflow.

---

### User Story 2 - Review Assignment Workload (Priority: P1)

As a student, I want to scan assignment cards in an organized list so that I can understand what I need to complete and when it is due.

**Why this priority**: Seeing assignment details and status is central to organizing schoolwork and acting on deadlines.

**Independent Test**: Display assignments with varied courses, due dates, and statuses; verify the list order, readable card details, deadline conditions, and empty/loading/error states.

**Acceptance Scenarios**:

1. **Given** a student has assignments, **When** they view the assignment list, **Then** each card identifies its title, due date, status, and course when present, with entries ordered by soonest due date first.
2. **Given** an assignment is overdue or due within the next 48 hours and is not completed, **When** its card is displayed, **Then** the deadline condition is stated in text and is not communicated by color alone.
3. **Given** assignments are loading, unavailable, or absent, **When** the student views the list, **Then** the corresponding loading, error, or empty state is clear; a search with no matches is distinguishable from a student with no assignments.
4. **Given** the page provides one or more actions for an assignment card, **When** the card is displayed, **Then** only the supplied mark-complete, edit, or delete actions appear and are operable; a card without supplied actions has no action controls.

---

### User Story 3 - Find and Navigate Assignment Results (Priority: P2)

As a student, I want to search and page through assignments so that I can locate a particular item without scanning an unnecessarily long list.

**Why this priority**: Search and pagination make assignment lists practical as a student's workload grows, while the core list remains useful without them.

**Independent Test**: Search a populated assignment collection by title, clear the query, and navigate across multiple result pages, including the first and last page boundaries.

**Acceptance Scenarios**:

1. **Given** assignments with different titles, **When** a student searches using a case-insensitive title query, **Then** matching assignments are shown and non-matching assignments are excluded.
2. **Given** a search has no matches, **When** the results are displayed, **Then** a clear no-results message appears and clearing the query restores the unfiltered assignment list.
3. **Given** results span multiple pages, **When** a student selects another page or uses the previous/next controls, **Then** the correct results and current page are shown, navigation cannot move beyond the first or last page, and the active search is retained.
4. **Given** results fit on one page, **When** the student views the list, **Then** pagination controls are not shown.

---

### User Story 4 - Create or Edit an Assignment (Priority: P1)

As a student, I want a clear assignment form for creating or updating schoolwork so that I can keep titles, courses, descriptions, deadlines, and status accurate.

**Why this priority**: Assignment capture and updates are essential to maintaining a useful workload list.

**Independent Test**: Open the form in create and edit contexts, submit valid and invalid values, and verify validation, cancellation, loading, and saved-value outcomes.

**Acceptance Scenarios**:

1. **Given** a student creates an assignment, **When** they open the form, **Then** they can enter a required title and deadline, optionally enter a course and description, and start with Pending status.
2. **Given** a student edits an assignment, **When** they open the form, **Then** its current values are shown and can be updated, including its status.
3. **Given** a required title or valid deadline is missing, **When** the student submits the form, **Then** the assignment is not saved and a specific error is associated with the relevant field.
4. **Given** a student cancels or submits the form, **When** the action completes, **Then** cancellation leaves the assignment unchanged and a valid save returns the updated assignment to the owning application flow without duplicate submission.
5. **Given** a student completes the form using a keyboard, **When** they reach a field with an error or a pending save, **Then** the field's label, error, and save state are available without relying on color alone.
6. **Given** a student enters more than 255 characters in the title, course, or description, **When** they submit the form, **Then** the form blocks submission, identifies the affected field, and preserves the entered value for correction.

---

### Edge Cases

- A long assignment title, course name, description, or navigation label must not obscure adjacent content or actions.
- An assignment with a past deadline but Completed status must not be presented as overdue.
- Assignment cards must not display empty action placeholders or actions that the page did not provide.
- A list with no assignments and a filtered list with no matches must have distinct explanations and appropriate next actions.
- Search results shrinking after a query change must not leave the student on an invalid page.
- Previous and next controls must remain unavailable at the first and last page respectively, including when there are no results.
- Invalid form values must remain available for correction and must not be silently discarded.
- Course and description values that are absent or blank are represented as empty strings in the existing non-null database columns; empty strings read from storage are presented as absent optional values. No schema change is part of this feature.
- A slow save must expose a pending state and must not allow duplicate creation or update.
- Layouts must remain usable with keyboard navigation at narrow and wide viewport sizes in light and dark appearances.
- Shared action, card, badge, and field patterns must remain consistent with the established Study-Mate interface when combined in an application-level component.

## Requirements *(mandatory)*

### Functional Requirements

#### Header and Assignment Presentation

- **FR-001**: The application MUST provide reusable Header, AssignmentCard, AssignmentList, AssignmentForm, AssignmentSearch, and Pagination components for their described user-facing tasks within the existing Study-Mate application shell.
- **FR-002**: Header MUST present the application identity and configured primary navigation, identify the current destination, and provide a usable menu at narrow viewport sizes.
- **FR-003**: AssignmentCard MUST identify the assignment title, deadline, status, and course when provided; optional description and page-provided mark-complete, edit, or delete actions MUST remain clearly associated with that assignment. Only supplied actions may appear, and invoking them MUST use the existing assignment flow.
- **FR-004**: AssignmentCard MUST distinguish overdue and due-within-48-hours assignments in readable text when they are not completed; completed assignments MUST NOT be presented as overdue.
- **FR-005**: AssignmentList MUST present assignments in soonest-deadline-first order and provide clear loading, failure, populated, and empty states. A no-search-match state MUST be distinguishable from an empty assignment collection.

#### Assignment Form, Search, and Pagination

- **FR-006**: AssignmentForm MUST support creating and editing an assignment with a required title and deadline, optional course and description, and one of the Pending, In Progress, or Completed statuses. Title, course, and description MUST each be limited to 255 characters.
- **FR-007**: A new assignment MUST start with Pending status; an edit form MUST show the assignment's current values.
- **FR-008**: AssignmentForm MUST identify missing titles, fields exceeding 255 characters, and invalid or missing deadlines with field-specific text, associate each error with its field, and prevent invalid values from being saved.
- **FR-009**: AssignmentForm MUST provide clear save and cancel actions, preserve entered values when validation fails, and prevent repeated submission while a save is pending.
- **FR-010**: AssignmentSearch MUST allow students to search assignments by title, clear a query, and understand when no assignments match.
- **FR-011**: AssignmentList MUST apply the controlled AssignmentSearch query to the complete assignment collection using case-insensitive title matching, update results immediately when the query changes, and reset the current page to page one so stale results are not presented as current.
- **FR-012**: Pagination MUST identify the current page and allow navigation among available result pages; previous/next and page-selection controls MUST prevent navigation beyond available results. AssignmentList MUST display only the current page's slice of the sorted matching results.
- **FR-013**: AssignmentList MUST retain the active search while changing pages and MUST omit Pagination when the result set fits on one page. Search and page changes MUST recompute the displayed result slice.

#### Shared Experience and Boundaries

- **FR-014**: Application-level components MUST reuse the established base UI patterns for buttons, cards, badges, lists, and form controls rather than introduce duplicate primitive controls.
- **FR-015**: Components MUST use existing semantic theme roles, remain legible in light and dark appearances, and follow the application's established typography, spacing, border, and responsive conventions.
- **FR-016**: Interactive controls MUST be operable by keyboard, expose accessible names and state, provide visible focus, and communicate status and validation without relying on color alone.
- **FR-017**: Essential labels, assignment details, and actions MUST remain visible and usable at narrow and wide viewport sizes without component-caused horizontal overflow.
- **FR-018**: These components MUST present and collect assignment information within the existing application flows; they MUST NOT introduce a new authentication model, assignment persistence mechanism, or unrelated application routes.
- **FR-019**: Automated browser tests MUST exercise critical assignment presentation and form flows through the existing root route in an in-memory fixture enabled only when `STUDY_MATE_E2E=1`. The fixture MUST NOT add a product route, connect to the database, or persist assignment data.

### Key Entities

- **Assignment**: A student's schoolwork item with a title, deadline, status, and optional course and description. Status is Pending, In Progress, or Completed.
- **Assignment Results**: The assignments currently presented after any active title search, ordered by deadline and divided into the available pages.
- **Navigation Destination**: An existing application section that can be reached from the shared header and identified as current.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six requested application-level components are available for their intended navigation, assignment presentation, entry, search, and paging tasks.
- **SC-002**: Every displayed assignment card identifies its title, due date, and status; a course is identified when supplied, and overdue/due-soon items are identifiable in text.
- **SC-003**: All submissions missing a required title or valid deadline, or exceeding 255 characters in title, course, or description, are blocked with an associated, field-specific message; valid submissions preserve the entered values.
- **SC-004**: For a test collection of assignments with known titles, AssignmentList displays exactly the case-insensitive title matches after each query change; clearing the query restores all eligible results and resets the page to one.
- **SC-005**: For any result count and page size, AssignmentList displays only the correct page slice, Pagination reports the correct current page, query state is retained when changing pages, and out-of-range navigation is prevented.
- **SC-006**: After the follow-on Assignment Page Integration feature provides the `/assignments` route and data flow, at least 9 of 10 target students, without assistance, can navigate to assignments, find a specified assignment, and identify how to create or edit an assignment. This post-integration usability goal is not a release gate for the reusable component library.
- **SC-007**: All interactive elements across the six application-level components can be operated by keyboard, and their purpose, state, and validation are available to assistive technology.
- **SC-008**: At 320-pixel and 1440-pixel viewport widths, all six components remain usable in light and dark appearances without component-caused horizontal overflow or obscured essential content.
- **SC-009**: For assignment cards configured with actions, only the configured actions appear and invoke the existing assignment flow; cards without configured actions show no action controls.
- **SC-010**: Playwright end-to-end tests pass for creating and editing an assignment, marking it completed, and viewing upcoming deadlines with readable status using the real components in the environment-gated in-memory fixture on `/`; the tests make no database writes.

## Assumptions

- The existing application's primary destinations and route behavior remain authoritative; Header exposes those destinations rather than adding routes.
- Assignment fields follow the established application specification: title and deadline are required; course and description are optional; assignment statuses are Pending, In Progress, and Completed.
- Assignment list data, authentication, persistence, and successful navigation remain owned by existing application flows; these components do not create a new backend or security boundary.
- AssignmentList owns local search and pagination state when given the complete assignment collection. The follow-on Assignment Page Integration feature owns the `/assignments` route, server data loading, and persistence/action wiring; it must pass the complete collection and configured page size to AssignmentList.
- The E2E fixture is enabled only for the Playwright web server with `STUDY_MATE_E2E=1` and uses in-memory data. The ordinary root page remains unchanged outside test mode.
- Omitted or whitespace-only course and description values are stored as `""` in the existing non-null columns and mapped back to `undefined` for optional UI presentation; the schema remains unchanged.
- A deadline within 48 hours is considered due soon, consistent with the existing Study-Mate requirements.
- The owning assignment flow supplies the page size; this feature does not prescribe a product-wide page-size preference.
- The existing base UI component library and semantic theme are available for reuse; no new runtime UI dependency or duplicate primitive layer is needed.
