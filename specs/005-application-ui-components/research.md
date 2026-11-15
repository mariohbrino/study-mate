# Research: Study-Mate Application-Level Components

## Decisions

### Existing stack and UI primitives

- **Decision**: Implement with the installed Next.js App Router, React, TypeScript,
  Tailwind CSS, base components in `src/components/ui/`, and the existing Vitest /
  React Testing Library setup. Add `@playwright/test` only as a development
  dependency for browser E2E tests.
- **Rationale**: The repository already has the required runtime and test tooling.
  `src/components/ui/index.ts` exports Button, Card, Input, Select, Badge, List,
  Checkbox, and Textarea. Vitest and Testing Library remain sufficient for isolated
  component behavior; they do not provide browser E2E coverage, which the constitution
  mandates for critical student flows. Playwright is the one justified test-only
  dependency. No runtime dependency is proposed.
- **Alternatives considered**: Adding a second component library or styling system
  would duplicate current capabilities. Using only Vitest would leave the
  constitution's critical-flow E2E requirement unmet.

### Component placement and existing application shell

- **Decision**: Replace `src/components/Navigation.tsx` with
  `src/components/Header.tsx`; put the five assignment-focused components in
  `src/components/assignments/`. Update `src/app/layout.tsx` to render Header rather
  than rendering a second global shell.
- **Rationale**: This follows the existing shared-component location and the project
  layout's feature-oriented organization. The current Navigation already contains
  route links, active-page indication, and a narrow-screen menu; the new Header should
  preserve those behaviors while replacing hardcoded zinc colors with semantic theme
  roles.
- **Alternatives considered**: Keeping Navigation beside a new Header was rejected
  because it would duplicate navigation and risk rendering two shared headers.
  Creating routes or page-level data flows was rejected because the specification
  limits this feature to reusable components.

### Server/client boundaries

- **Decision**: Keep AssignmentCard server-renderable. Use client behavior for Header
  (responsive menu/current pathname), AssignmentForm (interactive validation and
  pending submission), and AssignmentList (query/page state and result slicing).
  AssignmentSearch and Pagination remain controlled client controls composed by
  AssignmentList. Keep optional card actions as a caller-supplied render slot rather
  than embedding assignment mutation logic in the card.
- **Rationale**: The installed Next.js 16 guide says state and event handlers require
  Client Components, while data display can remain server-rendered. The boundary
  guide recommends composing Client Components inside Server Components and passing
  serialized data across the boundary. AssignmentList needs state because the complete
  assignment collection is filtered and paginated locally; the actual assignment
  page, server data loading, and persistence remain owned by a follow-on integration
  feature.
- **Alternatives considered**: Making every component a Client Component was rejected
  because it would ship unnecessary code. Giving AssignmentCard mutation callbacks
  was rejected because the card must not own or define assignment changes.
- **Integration note**: An event callback passed into a Client Component must come
  from a client-side owner; a Server Component can instead pass a Server Action where
  the owning flow provides one. The component library itself introduces no action or
  persistence endpoint.

### Assignment data and status representation

- **Decision**: Reuse the UI library's `AssignmentStatus` union (`pending`,
  `inProgress`, `completed`) and the existing database `dueAt` timestamp semantics.
  Keep the database's `in_progress` representation at the persistence boundary.
  When mapping a form submission to the existing non-null `course` and `description`
  columns, map omitted or whitespace-only values to `""`; when reading, map `""` to
  `undefined` for the optional UI fields. Do not change the schema.
- **Rationale**: `src/components/ui/types.ts` already defines the UI status type, and
  `src/database/schemas/assignments.schema.ts` constrains persisted values to
  `pending`, `in_progress`, or `completed`. Translation belongs to the existing data
  flow, not another UI status definition. The explicit empty-string mapping satisfies
  the current non-null database columns without making the optional fields required
  in the reusable form.
- **Alternatives considered**: Introducing a second status union or changing the
  database schema was rejected as duplication and out of scope.
- **Integration note**: This mapping documents the contract for the existing data
  flow; it does not add persistence to the component feature or authorize a schema
  change.

### Search, pagination, and test discovery

- **Decision**: AssignmentList receives the complete assignment collection and page
  size, owns local query/current-page state, and computes results through a shared
  pure helper. It matches titles case-insensitively, sorts by ascending deadline with
  stable source order for ties, resets to page one after query changes, clamps the
  page when results shrink, slices only the current page, and retains the query while
  changing pages. AssignmentSearch and Pagination remain controlled child components.
  The follow-on Assignment Page Integration feature owns the `/assignments` route,
  server data loading, and persistence/action wiring. Extend Vitest discovery to all
  component tests.
- **Rationale**: This keeps Search and Pagination reusable controlled controls while
  placing filtering and paging with the results container that composes them. It
  avoids deferring required result behavior to an assignment page outside this
  feature's scope. A pure helper makes case-insensitive matching, stable ordering,
  reset/clamp behavior, and slicing independently testable.
- **Alternatives considered**: Adding client-side fetching or a new pagination/search
  package was rejected because neither is needed for these UI controls.

### Critical-flow browser testing

- **Decision**: Add `@playwright/test` as a development dependency, with a Playwright
  configuration that starts the existing `/` root route in an environment-gated
  E2E mode using `STUDY_MATE_E2E=1`. In that mode only, render a fixture backed by
  in-memory assignment state and exercise creation, editing, completion, and upcoming
  deadline presentation.
  With the flag unset, the normal root page remains unchanged. Add no product route
  and make no database writes.
- **Rationale**: The constitution explicitly requires E2E tests for critical flows,
  and the repository currently has no browser automation package or E2E suite.
  Playwright is isolated to development tooling and exercises the real components
  through a browser without depending on an out-of-scope assignment route or schema.
- **Alternatives considered**: Component-only tests do not meet the constitution's
  browser-flow requirement. Adding an assignment route or test persistence would
  expand the approved feature scope unnecessarily.

## Repository Evidence

- The root layout currently renders `src/components/Navigation.tsx`.
- Navigation uses `usePathname` and `useState`; it is already a Client Component.
- The only assignment source artifact found is the Drizzle schema; no assignment
  page, query module, or component exists in `src/`.
- The existing `/` root page is the only App Router page available for an
  environment-gated in-memory E2E fixture; the actual `/assignments` page belongs to
  the follow-on Assignment Page Integration feature.
- The project has a `format` npm script and Vitest component-test script, but no
  Playwright dependency, Playwright configuration, or E2E script.
- The existing UI primitives already expose labeled fields, status badges, list empty
  states, and card composition.
- The installed Next.js documentation was reviewed at
  `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  and `node_modules/next/dist/docs/01-app/02-guides/server-and-client-boundary.md`.
