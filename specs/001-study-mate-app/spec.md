# Feature Specification: Study-Mate — Student Assignment & Study Planner

**Feature Branch**: `001-study-mate-app`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Study-Mate is a web application that helps students organize their assignments, track deadlines, and plan their study activities. Students can use it to manage their schoolwork in one place and see which tasks they have completed and which ones still need attention. Include: a project title and description, the purpose and target audience, user stories for core workflows (sign up, create, read, update, delete), acceptance criteria for each story, API endpoints, and implementation priority."

## Overview

### Project Title

**Study-Mate** — a web application for organizing assignments, tracking deadlines, and planning study activities.

### Description

Study-Mate gives students a single place to manage their schoolwork. A student creates an account, records assignments with their deadlines, and sees at a glance which tasks are completed and which still need attention. The application highlights upcoming and overdue deadlines so students can prioritize their time and plan study activities around their actual workload.

### Purpose

Students commonly juggle assignments across multiple courses using scattered tools (paper planners, notes apps, memory). Study-Mate's purpose is to reduce missed deadlines and last-minute cramming by consolidating all schoolwork into one organized, always-current view that distinguishes finished work from outstanding work.

### Target Audience

- **Primary**: High-school and university students managing assignments across multiple courses.
- **Secondary**: Adult learners and students in online programs who self-manage their study schedules.

Users are assumed to have basic web literacy, a personal email address, and access to a desktop or mobile browser.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign Up & Sign In (Priority: P1)

A new student visits Study-Mate, creates an account with their email and a password, and signs in. Returning students sign in with their credentials and land on their personal dashboard. Each student sees only their own assignments.

**Why this priority**: Every other workflow depends on a student having a private account. Without authentication there is no per-student data, so this is the foundation of the product.

**Independent Test**: Can be fully tested by registering a new account, signing out, signing back in, and confirming the session reaches a personal (empty) dashboard that no other account can access.

**Acceptance Scenarios**:

1. **Given** a visitor with no account, **When** they submit a valid email and a password meeting the minimum strength rule, **Then** an account is created and they are signed in and taken to their dashboard.
2. **Given** a visitor submits an email already in use, **When** they attempt to sign up, **Then** the account is not created and a clear message explains the email is already registered.
3. **Given** a registered student, **When** they sign in with correct credentials, **Then** they reach their dashboard showing only their own assignments.
4. **Given** a registered student, **When** they sign in with an incorrect password, **Then** access is denied with a generic error message that does not reveal whether the email exists.
5. **Given** a signed-in student, **When** they sign out, **Then** their session ends and protected pages are no longer accessible without signing in again.

---

### User Story 2 - Create an Assignment (Priority: P1)

A signed-in student adds a new assignment by entering a title, an optional description, the course or subject it belongs to, and a deadline. The assignment appears immediately in their list as "not completed."

**Why this priority**: Capturing assignments is the core value proposition — without the ability to record work, nothing else in the product matters.

**Independent Test**: Can be fully tested by signing in, creating an assignment with a title and deadline, and confirming it appears in the assignment list with the correct details and an incomplete status.

**Acceptance Scenarios**:

1. **Given** a signed-in student on their dashboard, **When** they create an assignment with a title and a future deadline, **Then** the assignment is saved and appears in their list marked as not completed.
2. **Given** a student creating an assignment, **When** they omit the title, **Then** the assignment is not saved and a message identifies the missing required field.
3. **Given** a student creating an assignment, **When** they enter an invalid deadline (e.g., malformed date), **Then** the assignment is not saved and a message explains the problem.
4. **Given** a student creates an assignment, **When** another student signs in, **Then** the other student cannot see that assignment.

---

### User Story 3 - View Assignments & Deadlines (Priority: P1)

A signed-in student views their assignments in a list ordered by deadline. The view clearly separates completed tasks from tasks that still need attention, and visually flags assignments that are overdue or due soon.

**Why this priority**: Seeing the full workload at a glance — what's done, what's pending, what's urgent — is the main daily-use value of the product.

**Independent Test**: Can be fully tested by seeding an account with assignments of varied deadlines and statuses, then confirming the list orders by deadline and correctly distinguishes completed, pending, due-soon, and overdue items.

**Acceptance Scenarios**:

1. **Given** a student with several assignments, **When** they open their dashboard, **Then** all of their assignments are listed ordered by deadline (soonest first).
2. **Given** a student has both completed and pending assignments, **When** they view the list, **Then** completed and pending items are visually distinct and can be filtered by status.
3. **Given** an assignment whose deadline has passed and is not completed, **When** the student views the list, **Then** the assignment is flagged as overdue.
4. **Given** an assignment due within the next 48 hours, **When** the student views the list, **Then** the assignment is flagged as due soon.
5. **Given** a student with no assignments, **When** they open their dashboard, **Then** they see an empty state inviting them to create their first assignment.

---

### User Story 4 - Update an Assignment & Mark It Complete (Priority: P2)

A signed-in student edits an existing assignment's details (title, description, course, deadline) and toggles its completion status when the work is done — or back to pending if marked complete by mistake.

**Why this priority**: Plans change and work gets done; keeping assignments accurate and checking them off is essential to tracking progress, but it requires creation and viewing to exist first.

**Independent Test**: Can be fully tested by editing an existing assignment's fields, marking it complete, confirming the list reflects the changes, then reverting it to pending.

**Acceptance Scenarios**:

1. **Given** an existing assignment, **When** the student edits its title or deadline and saves, **Then** the updated details appear in the list.
2. **Given** a pending assignment, **When** the student marks it complete, **Then** it immediately shows as completed and no longer appears among tasks needing attention.
3. **Given** a completed assignment, **When** the student marks it as not completed, **Then** it returns to the pending list (and is flagged overdue if its deadline has passed).
4. **Given** a student editing an assignment, **When** they clear the title and attempt to save, **Then** the change is rejected with a message identifying the required field.
5. **Given** an assignment belonging to another student, **When** a student attempts to modify it, **Then** the change is refused.

---

### User Story 5 - Delete an Assignment (Priority: P2)

A signed-in student removes an assignment they no longer need (e.g., it was cancelled or entered by mistake). The application asks for confirmation before permanently deleting it.

**Why this priority**: Keeping the list clean matters for trust in the tool, but deletion is used less often than creating, viewing, and updating.

**Independent Test**: Can be fully tested by deleting an existing assignment, confirming the confirmation prompt appears, and verifying the assignment no longer appears in the list.

**Acceptance Scenarios**:

1. **Given** an existing assignment, **When** the student chooses to delete it and confirms, **Then** the assignment is permanently removed from their list.
2. **Given** an existing assignment, **When** the student chooses to delete it but cancels the confirmation, **Then** the assignment remains unchanged.
3. **Given** an assignment belonging to another student, **When** a student attempts to delete it, **Then** the deletion is refused.

---

### User Story 6 - Plan Study Activities (Priority: P3)

A signed-in student creates study plan entries — focused study sessions with a subject, date, and duration — optionally linked to a specific assignment. The student sees upcoming study sessions alongside their deadlines so they can prepare ahead of time instead of cramming.

**Why this priority**: Study planning adds proactive value beyond deadline tracking, but the product is already useful without it; it builds on assignments and deadlines.

**Independent Test**: Can be fully tested by creating a study session linked to an assignment, viewing it in the upcoming plan, editing its time, and deleting it.

**Acceptance Scenarios**:

1. **Given** a signed-in student, **When** they create a study session with a subject, date, and duration, **Then** it appears in their upcoming study plan.
2. **Given** a study session linked to an assignment, **When** the student views the session, **Then** the linked assignment and its deadline are visible.
3. **Given** an existing study session, **When** the student edits or deletes it, **Then** the study plan reflects the change immediately.

---

### Edge Cases

- What happens when a student creates an assignment with a deadline in the past? It is accepted (students may back-fill work) but immediately flagged as overdue.
- How does the system handle two assignments with identical titles and deadlines? Both are kept; assignments are distinct records and duplicates are the student's choice.
- What happens when a student's session expires mid-edit? The save is rejected, the student is asked to sign in again, and no partial data is stored.
- What happens when a linked assignment is deleted while study sessions reference it? The study sessions remain but lose the link, shown as "no linked assignment."
- How does the system behave with a very large number of assignments (hundreds)? The list remains usable via deadline ordering and status filtering; no data is silently truncated.
- What happens when a student submits the same creation form twice rapidly (double-click)? Only one assignment is created.

## Requirements *(mandatory)*

### Functional Requirements

#### Accounts & Access

- **FR-001**: System MUST allow visitors to create an account using an email address and a password of at least 8 characters.
- **FR-002**: System MUST reject sign-up attempts with an email address that is already registered, with a clear message.
- **FR-003**: System MUST allow registered students to sign in with their credentials and sign out on demand.
- **FR-004**: System MUST deny sign-in with invalid credentials using a generic error that does not disclose whether the email exists.
- **FR-005**: System MUST restrict every assignment and study session to the student who created it; no student may read, modify, or delete another student's data.
- **FR-006**: System MUST require an authenticated session for all assignment and study plan operations.

#### Assignments (Create / Read / Update / Delete)

- **FR-007**: Students MUST be able to create an assignment with a required title and deadline, and optional description and course/subject.
- **FR-008**: System MUST validate assignment input (non-empty title, valid deadline date) and report specific, user-friendly errors without saving invalid data.
- **FR-009**: Students MUST be able to view all of their assignments ordered by deadline, soonest first.
- **FR-010**: System MUST display each assignment's completion status and allow filtering by completed vs. pending.
- **FR-011**: System MUST flag assignments as overdue when their deadline has passed and they are not completed, and as due soon when the deadline is within 48 hours.
- **FR-012**: Students MUST be able to edit an assignment's title, description, course/subject, and deadline.
- **FR-013**: Students MUST be able to mark an assignment complete and revert it to not completed.
- **FR-014**: Students MUST be able to delete an assignment after an explicit confirmation step.
- **FR-015**: System MUST persist all assignment data so it survives sign-out, browser restarts, and new devices.

#### Study Plan

- **FR-016**: Students MUST be able to create, view, edit, and delete study sessions with a subject, date, and duration.
- **FR-017**: Students MUST be able to optionally link a study session to one of their assignments; deleting the assignment removes the link but keeps the session.

### Key Entities

- **Student**: A registered user of the application. Key attributes: unique email address, display name, credentials. Owns all of their assignments and study sessions.
- **Assignment**: A piece of schoolwork to complete. Key attributes: title (required), description (optional), course/subject (optional), deadline (required), completion status, creation time. Belongs to exactly one student.
- **Study Session**: A planned block of study time. Key attributes: subject, scheduled date, duration, optional link to one assignment. Belongs to exactly one student.

## API Endpoints

*(Included at the user's explicit request. Endpoint shapes are indicative contracts for planning; they describe capabilities, not final implementation.)*

### Authentication

| Method | Endpoint | Purpose | Auth required |
|--------|----------|---------|---------------|
| POST | `/api/auth/signup` | Create a new student account | No |
| POST | `/api/auth/login` | Sign in and start a session | No |
| POST | `/api/auth/logout` | End the current session | Yes |
| GET | `/api/auth/me` | Return the signed-in student's profile | Yes |

### Assignments

| Method | Endpoint | Purpose | Auth required |
|--------|----------|---------|---------------|
| GET | `/api/assignments` | List the student's assignments (supports status filter, ordered by deadline) | Yes |
| POST | `/api/assignments` | Create a new assignment | Yes |
| GET | `/api/assignments/{id}` | Read a single assignment | Yes |
| PATCH | `/api/assignments/{id}` | Update assignment fields and/or completion status | Yes |
| DELETE | `/api/assignments/{id}` | Delete an assignment | Yes |

### Study Sessions

| Method | Endpoint | Purpose | Auth required |
|--------|----------|---------|---------------|
| GET | `/api/study-sessions` | List the student's upcoming study sessions | Yes |
| POST | `/api/study-sessions` | Create a study session | Yes |
| PATCH | `/api/study-sessions/{id}` | Update a study session | Yes |
| DELETE | `/api/study-sessions/{id}` | Delete a study session | Yes |

All endpoints operate only on the authenticated student's own data; requests for another student's records are refused.

## Implementation Priority

| Phase | Scope | User Stories | Rationale |
|-------|-------|--------------|-----------|
| 1 (MVP) | Accounts and core assignment capture and visibility | Story 1 (Sign Up & Sign In), Story 2 (Create), Story 3 (View) | Minimum product that delivers the core promise: record schoolwork and see deadlines in one place |
| 2 | Keeping the list accurate | Story 4 (Update & Complete), Story 5 (Delete) | Completes full task management and progress tracking |
| 3 | Proactive planning | Story 6 (Study Plan) | Adds forward-looking study planning on top of a working tracker |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new student can go from first visit to having their first assignment recorded in under 3 minutes.
- **SC-002**: A returning student can determine which tasks still need attention within 10 seconds of opening their dashboard.
- **SC-003**: 100% of overdue, not-completed assignments are visibly flagged on the assignment list.
- **SC-004**: 95% of students successfully complete the create-assignment flow on their first attempt without external help.
- **SC-005**: No student can ever view, modify, or delete another student's assignments or study sessions (zero cross-account data exposure).
- **SC-006**: Assignment data entered on one device is visible when the same student signs in on another device, with no data loss across sessions.
- **SC-007**: Common actions (viewing the list, saving an assignment, toggling completion) feel immediate — completing in under 2 seconds under normal conditions.

## Assumptions

- Authentication uses standard email-and-password credentials with session-based access; third-party sign-in (Google, school SSO) is out of scope for v1.
- Password reset via email is desirable but out of scope for the initial release; it can be added after MVP.
- Each account belongs to a single student; there are no teacher, parent, or admin roles, and no sharing or collaboration features in v1.
- "Due soon" is defined as a deadline within the next 48 hours; this threshold may become configurable later.
- Deadlines are tracked as date and time in the student's local time zone.
- Notifications (email or push reminders) are out of scope for v1; urgency is conveyed visually within the app.
- The application is used in a modern web browser on desktop or mobile; offline use is out of scope.
- Deleted assignments are permanently removed; no trash/undo facility is required in v1.
- Courses/subjects are free-text labels on assignments, not a separately managed entity, for v1.
