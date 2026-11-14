# Data Model: Study-Mate Application-Level Components

These are UI-facing shapes for the reusable components, not new persistence entities.
The existing assignment data flow and database schema remain authoritative.

## Assignment

| Field | UI type | Rules |
|---|---|---|
| `id` | `string` | Stable identity for list keys and page-supplied actions. |
| `title` | `string` | Required; trimmed value must not be empty; maximum 255 characters to fit the existing schema. |
| `course` | `string \| undefined` | Optional in the form and presentation; maximum 255 characters when supplied. Omitted or whitespace-only submission maps to `""` in the existing non-null database column; an empty stored string maps to `undefined` in the UI. |
| `description` | `string \| undefined` | Optional in the form and presentation; maximum 255 characters when supplied. Omitted or whitespace-only submission maps to `""` in the existing non-null database column; an empty stored string maps to `undefined` in the UI. |
| `dueAt` | `Date` | Required, valid deadline; sourced from the existing timestamp field. |
| `status` | `AssignmentStatus` | Reuse `pending \| inProgress \| completed` from `src/components/ui/types.ts`. |

The database stores the in-progress status as `in_progress`; conversion between
database and UI representations remains with the owning data flow. Normalize optional
values at that boundary: map omitted or whitespace-only `course` and `description`
values to `""`, preserve nonblank entered values, and map empty stored strings back to
`undefined` for UI presentation. The database schema is unchanged.

## Assignment Form Values

| Field | UI type | Rules |
|---|---|---|
| `title` | `string` | Required after trimming; maximum 255 characters; field-specific error on missing or over-limit input. |
| `course` | `string` | Optional; maximum 255 characters; empty string represents no course in the form. |
| `description` | `string` | Optional; maximum 255 characters; empty string represents no description in the form. |
| `dueAt` | `string` | Required browser form value; must parse as a valid deadline before submission. |
| `status` | `AssignmentStatus` | Defaults to `pending` in create mode; edit mode receives the current value. |

AssignmentForm enforces the 255-character maximum for title, course, and description
and blocks an over-limit submission with a field-associated message while retaining
the entered value. The owning flow converts the form deadline into the existing
timestamp representation. Other validation failures retain user-entered values. A
pending submission disables duplicate submission and exposes a readable status.

## Assignment Results

| Field | UI type | Rules |
|---|---|---|
| `assignments` | `Assignment[]` | Complete input collection supplied to AssignmentList; matching results are sorted by ascending deadline with stable source order for ties before display. |
| `query` | `string` | Local AssignmentList state controlled through AssignmentSearch; matching is case-insensitive and clearing restores all assignments. |
| `currentPage` | `number` | Local one-based AssignmentList state; resets to one when query changes and is clamped when result count shrinks. |
| `pageSize` | `number` | Positive integer supplied by the owning page/integration feature. |
| `matchingAssignments` | `Assignment[]` | Derived by case-insensitive title matching and ascending-deadline stable sort. |
| `pageCount` | `number` | Derived from matching result count and page size; pagination controls are omitted at zero or one page. |
| `displayedAssignments` | `Assignment[]` | The current page slice of matching assignments rendered by AssignmentList. |
| `listState` | `"loading" \| "error" \| "empty" \| "no-results" \| "populated"` | Loading/error are supplied by the data owner; AssignmentList distinguishes a truly empty collection from no query matches and populated results. |

AssignmentSearch and Pagination remain controlled children of AssignmentList.
AssignmentList handles query changes by clearing the active page to one, retains the
query when the page changes, recomputes the sorted match set and current slice, and
clamps the current page if the assignment collection shrinks. Search and page state
are local and are not persisted. The follow-on Assignment Page Integration feature
owns the `/assignments` route, server data loading, and persistence/action wiring.

## Deadline Presentation

Deadline state is derived from the assignment status, its deadline, and the current
time; it is not stored separately.

- **Overdue**: deadline is before now and status is not `completed`.
- **Due soon**: deadline is within the next 48 hours and status is not `completed`.
- **Completed**: never presented as overdue or due soon.
- Conditions are communicated with visible text as well as any semantic badge styling.

The boundary between due soon and ordinary upcoming work follows the 48-hour
definition in the feature specification.

## Navigation Destination

| Field | UI type | Rules |
|---|---|---|
| `label` | `string` | Visible accessible name. |
| `href` | `string` | Existing application route; no route is created by this feature. |
| current state | `boolean` | Derived from the active pathname and exposed with `aria-current="page"`. |

The Header preserves the existing configured destinations and responsive menu behavior.
