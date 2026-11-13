# Study-Mate Project Layout

## 1. Overview

Study-Mate is a study companion application designed to help students

organize assignments, manage deadlines, and plan study sessions.

The application will provide a simple and responsive interface that

allows students to track their academic responsibilities.

## 2. Application Routes

The application will include the following main routes:

| Route | Purpose |

|---|---|

| `/` | Redirects authenticated users to the dashboard and unauthenticated users to the login page. |

| `/login` | Allows existing users to sign in. |

| `/signup` | Allows new users to create an account. |

| `/dashboard` | Displays an overview of assignments and study activities. |

| `/assignments` | Displays and manages student assignments. |

| `/assignments/new` | Allows users to create a new assignment. |

| `/assignments/[id]` | Displays the details of a specific assignment. |

| `/study-plan` | Displays and manages study sessions. |

## 3. Shared Layout

The application will use two main layouts:

### Authentication Layout

The login and signup pages will use a simple layout without the main

application navigation.

This layout will include:

- Study-Mate logo.

- Authentication form.

- Links to switch between login and signup.

### Main Application Layout

The dashboard, assignments, and study plan pages will share the

same main layout.

This layout will include:

**Header**

- Study-Mate logo.

- User profile access.

- Main navigation.

**Navigation**

- Dashboard.

- Assignments.

- Study Plan.

**Main Content**

- Displays the content of the selected page.

**Footer**

- Application name.

- Copyright information.

## 4. Page Wireframes

### 4.1 Dashboard

The dashboard will provide a quick overview of the student's academic

activities.

Its main sections will include:

**Welcome Section**

- Greeting message for the user.

- Short description or reminder.

**Summary Cards**

- Pending assignments.

- Assignments due soon.

- Completed assignments.

**Upcoming Assignments**

- Assignment title.

- Due date.

- Assignment status.

- Link to view assignment details.

**Upcoming Study Sessions**

- Session subject or title.

- Scheduled date and time.

- Session duration.

**Quick Actions**

- Button to create a new assignment.

- Link to view all assignments.

### 4.2 Assignments

The assignments page will allow students to view, organize, and manage

their academic assignments.

Its main sections will include:

**Page Header**

- Page title: Assignments.

- Button to create a new assignment.

**Search and Filters**

- Search assignments by title.

- Filter by status: Pending, In Progress, and Completed.

- Use the same assignment statuses defined in the project specification.

- Identify overdue assignments based on their due dates.

**Assignment List**

- Assignment title.

- Course or subject.

- Due date.

- Assignment status.

- Link to view assignment details.

**Assignment Actions**

- Create a new assignment.

- View assignment details.

- Edit an existing assignment.

- Delete an assignment.

- Mark an assignment as completed.

### 4.3 New Assignment

The new assignment page will allow students to create academic tasks.

Its main sections will include:

**Assignment Form**

- Assignment title (required).

- Course or subject (optional).

- Description (optional).

- Due date (required).

- Initial status.

**Form Actions**

- Save the new assignment.

- Cancel and return to the assignments page.

The form will provide clear validation messages when required

information is missing or invalid.

### 4.4 Assignment Details

The assignment details page will display all information about a

selected assignment.

Its main sections will include:

**Assignment Information**

- Assignment title.

- Course or subject.

- Description.

- Due date.

- Current status.

**Assignment Actions**

- Edit assignment information.

- Delete the assignment.

- Mark the assignment as completed.

- Return to the assignments list.

### 4.5 Study Plan

The study plan page will allow students to organize and manage their

study sessions.

Its main sections will include:

**Page Header**

- Page title: Study Plan.

- Button to create a new study session.

**Study Session List**

- Session title or subject.

- Scheduled date and time.

- Session duration.

- Linked assignment (optional).

**Study Session Actions**

- Create a new study session.

- View session information.

- Edit an existing session.

- Delete a study session.

**Study Session Form**

- Session title (required).

- Subject or course (optional).

- Date and time (required).

- Duration (required).

- Related assignment (optional).

### 4.6 Login Page

The login page will allow existing users to access their accounts.

Its main sections will include:

**Login Form**

- Email address (required).

- Password (required).

**Form Actions**

- Sign in button.

- Link to the signup page.

- Validation messages for incorrect or missing information.

The page will use a simple layout without the main application navigation.

### 4.7 Signup Page

The signup page will allow new users to create a Study-Mate account.

Its main sections will include:

**Registration Form**

- Full name (required).

- Email address (required).

- Password (required, minimum 8 characters).

**Form Actions**

- Create account button.

- Link to the login page.

- Validation messages for missing or invalid information.

The page will use the same simple authentication layout as the login page.

## 5. Responsive Design

Study-Mate will provide a responsive interface that adapts to desktop,

tablet, and mobile screen sizes.

### Desktop

- Display the main navigation horizontally.

- Use multiple columns for dashboard summary cards.

- Display assignments and study sessions in organized lists or cards.

- Keep forms centered with a comfortable width.

- Maintain consistent spacing between sections.

### Tablet

- Adjust content to fit smaller screen widths.

- Reduce the number of columns when necessary.

- Keep navigation accessible.

- Maintain readable text and comfortable spacing.

### Mobile

- Use a compact navigation menu.

- Display cards in a single column.

- Make forms use the available screen width.

- Keep buttons large enough for touch interaction.

- Prevent horizontal scrolling.

- Prioritize important information such as assignment titles,
  due dates, and statuses.

### General Responsive Rules

- Use flexible layouts and relative sizing.

- Maintain readable typography across screen sizes.

- Ensure buttons and interactive elements are easy to use.

- Keep the interface consistent across all devices.

## 6. Component Structure

The application will use reusable React components to maintain a

consistent design and avoid repeating code.

The components will be organized by their responsibilities.

### Layout Components

These components will provide the shared application structure.

- Header: Displays the application logo and user navigation.

- Navigation: Provides links to the main application pages.

- Footer: Displays application information and copyright details.

### Dashboard Components

These components will display the student's academic overview.

- SummaryCard: Displays assignment statistics.

- UpcomingAssignments: Displays assignments with approaching deadlines.

- UpcomingStudySessions: Displays scheduled study sessions.

### Assignment Components

These components will support assignment management.

- AssignmentCard: Displays assignment information.

- AssignmentForm: Provides fields for creating and editing assignments.

- AssignmentFilters: Allows users to search and filter assignments.

### Study Plan Components

These components will support study session management.

- StudySessionCard: Displays study session information.

- StudySessionForm: Provides fields for creating and editing sessions.

### Authentication Components

These components will support account access.

- LoginForm: Provides the login fields.

- SignupForm: Provides the registration fields.

Components should be reusable whenever possible. Each component

should have a clear responsibility and use TypeScript for its props.

## 7. Layout Rules

The following rules will help maintain a consistent and accessible

user interface throughout the application.

### Navigation

- Keep the main navigation consistent across authenticated pages.

- Provide clear links between the main application sections.

- Make the current page easy to identify.

- Keep authentication pages separate from the main application navigation.

### Visual Consistency

- Use consistent spacing, typography, and colors.

- Reuse components instead of creating duplicate elements.

- Use clear headings and labels.

- Display information in an organized and readable way.

### Accessibility

- Use semantic HTML elements.

- Provide labels for form fields.

- Ensure sufficient color contrast.

- Make interactive elements accessible by keyboard.

- Provide clear validation and error messages.

### Maintainability

- Organize components by feature and responsibility.

- Use TypeScript for component props.

- Keep components focused on a single responsibility.

- Follow the project's existing coding and formatting conventions.

### Implementation Guidelines

- Use Next.js App Router for page routing.

- Use shared layouts for common application structures.

- Use Server Components by default.

- Use Client Components only when interactivity is required.

- Follow the approved project specification before implementing new features.
