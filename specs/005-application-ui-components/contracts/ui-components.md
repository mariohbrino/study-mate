# UI Component Contracts

These contracts define reusable presentation and interaction boundaries. They do not
create application routes, assignment persistence, or mutation APIs. All components
compose the existing primitives exported from `src/components/ui/`.

## Shared Types

```ts
import type { AssignmentStatus } from "@/components/ui";

type Assignment = {
  id: string;
  title: string;
  course?: string;
  description?: string;
  dueAt: Date;
  status: AssignmentStatus;
};

type AssignmentFormValues = {
  title: string;
  course: string;
  description: string;
  dueAt: string;
  status: AssignmentStatus;
};

type NavigationItem = {
  label: string;
  href: string;
};
```

The data owner maps the database's `in_progress` value to the UI's `inProgress`.

## Header

- **Inputs**: no required public props; use the existing configured navigation items.
  The current destination is derived from the App Router pathname.
- **Output**: application identity and navigation links; current link is identified
  with `aria-current="page"`.
- **Behavior**: preserve existing destinations; provide a narrow-screen menu with
  `aria-expanded`, an accessible name, visible keyboard focus, and close-on-navigation.
- **Composition**: replace the current `Navigation` in the root layout; do not render
  both.

## AssignmentCard

- **Inputs**: one `Assignment` and an optional caller-owned `ReactNode` action slot.
- **Output**: title, formatted deadline, status badge, optional course/description,
  and readable overdue/due-soon text where applicable.
- **Behavior**: completed assignments are not called overdue or due soon. No action
  controls render unless supplied. The card does not own mutation behavior.
- **Composition**: server-renderable; compose existing Card, Badge, and other base
  primitives.

## AssignmentList

- **Inputs**: the complete assignment collection, positive `pageSize`, and optional
  loading/error state and message from the data owner.
- **Output**: a semantic list of AssignmentCards for the current result slice, or a
  clear loading, error, empty, or no-results presentation.
- **Behavior**: own the local query and one-based current page. Filter all supplied
  assignments by case-insensitive title match, sort matching entries by ascending
  deadline with stable source order for ties, and render only the current page slice.
  Reset to page one after a query change, retain the active query when changing pages,
  and clamp the page when the collection shrinks. Keep no assignments distinct from
  no query matches; loading and errors must not masquerade as an empty success state.
- **Composition**: Client Component that composes controlled AssignmentSearch and
  Pagination with the existing List primitive and AssignmentCard. The complete
  collection, page size, and data state are supplied by the owning application
  feature; AssignmentList does not fetch or persist data.

## AssignmentForm

- **Inputs**: `mode` (`create` or `edit`), optional initial values, submission-pending
  state, a submit handler/action, and a cancel handler.
- **Output**: values matching `AssignmentFormValues`.
- **Behavior**: title and deadline are required; course and description are optional;
  title, course, and description each have a 255-character maximum; over-limit values
  receive field-associated errors and remain available for correction; create defaults
  to Pending; edit prepopulates current values; validation failure retains values;
  pending state prevents duplicate submit; cancel does not submit.
- **Composition**: Client Component for interactive validation/submission state;
  compose existing Input, Textarea, Select, and Button. A callback must be owned by a
  client consumer, or the owning Server Component must provide a Server Action.

## AssignmentSearch

- **Inputs**: controlled query value, query-change handler, and optional clear handler.
- **Output**: accessible labeled search input and a clear control when query is
  non-empty.
- **Behavior**: emit each query change and support clearing. AssignmentList controls
  the value, performs case-insensitive title filtering, resets to page one on query
  changes, and recomputes the displayed slice.
- **Composition**: Client Component; compose existing Input and Button.

## Pagination

- **Inputs**: one-based `currentPage`, derived `pageCount`, and page-change handler
  controlled by AssignmentList.
- **Output**: current-page description and previous/next plus page-selection controls.
- **Behavior**: omit controls for zero or one page; disable or omit unavailable
  boundary navigation; never request a page outside `1..pageCount`. AssignmentList
  retains the active search and computes/clamps the page slice.
- **Composition**: Client Component; compose existing Button.

## Cross-Component Requirements

- Use semantic theme utilities and existing base component variants; do not add
  arbitrary palette values or duplicate primitives.
- Use semantic HTML, explicit labels, accessible names, keyboard operation, and
  visible focus states. Communicate errors, status, and deadline urgency with text,
  not color alone.
- Keep presentation responsive at 320px and 1440px, in light and dark modes.
- Keep ordinary data display server-renderable where practical and pass only
  serializable data across server/client boundaries; do not pass ordinary closures
  from a Server Component to a Client Component.
- AssignmentList is the client-side consumer for Search and Pagination events. The
  follow-on Assignment Page Integration feature owns the `/assignments` route, server
  data loading, and persistence/action wiring; it supplies the complete collection,
  page size, and data state.
- The existing `/` root route may render an in-memory fixture only when
  `STUDY_MATE_E2E=1`; normal rendering remains unchanged, with no new product route or
  database writes.
