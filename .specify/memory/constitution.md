<!--
Sync Impact Report
==================
Version change: [template] → 1.0.0 (initial ratification)
Modified principles: n/a (all principles newly defined)
Added sections:
  - Core Principles (I–VI)
  - Technology Stack Constraints
  - Development Workflow & Quality Gates
  - Governance
Removed sections: none (all template placeholders filled)
Follow-up TODOs: none
Note: This comment is review scratch material; remove before committing the file.
-->

# Study-Mate Constitution

Study-Mate is a web application that helps students organize their assignments, track
deadlines, and plan their study activities. Students manage their schoolwork in one place
and see which tasks are completed and which still need attention. This constitution
defines the non-negotiable engineering principles that govern all work on the project.

## Core Principles

### I. TypeScript Strictness

All source code MUST be written in TypeScript with `strict: true` enabled in
`tsconfig.json`; this setting MUST NOT be weakened or selectively disabled.

- The `any` type is forbidden in first-party code — explicit or implicit. Use `unknown`
  with narrowing, generics, or precise union types instead.
- Type assertions (`as`) are a last resort and MUST be accompanied by a comment
  explaining why the type system cannot verify the value.
- `@ts-ignore` / `@ts-expect-error` are forbidden except for documented upstream type
  bugs, and MUST include a justification comment.
- Public functions, exported APIs, and component props MUST have explicit types; rely on
  inference only for local variables.
- `npm run typecheck` MUST pass with zero errors before any merge.

Rationale: strict typing catches defects at compile time, documents intent, and keeps a
multi-contributor codebase safe to refactor.

### II. Utility-First Styling with Tailwind CSS

All styling MUST use Tailwind CSS utility classes applied directly in JSX.

- Custom CSS (new stylesheets, CSS modules, `@apply` blocks, inline `style` props) is
  permitted only when a utility-based solution is demonstrably impossible (e.g., complex
  keyframe animations, third-party widget overrides), and each exception MUST be
  justified in the pull request description.
- Design tokens (colors, spacing, fonts) MUST be defined through Tailwind theme
  configuration, never as ad-hoc hex values or magic numbers scattered in markup.
- Repeated utility combinations MUST be extracted into reusable components, not copied
  across files and not hidden behind `@apply`.
- Class ordering follows `prettier-plugin-tailwindcss`; formatting MUST pass
  `npm run format`.

Rationale: utility-first styling keeps styles co-located, eliminates dead CSS, and makes
visual changes reviewable in a single diff.

### III. Next.js App Router Discipline

The application MUST use the Next.js App Router with file-based routing under `src/`.

- Components are Server Components by default. `"use client"` MUST be added only when
  the component genuinely needs browser APIs, state, effects, or event handlers — and
  MUST be placed at the smallest possible subtree (leaf components, not page roots).
- Data fetching and mutations MUST happen on the server (Server Components, Route
  Handlers, or Server Actions). Client-side fetching is an exception that requires
  justification.
- Routing MUST use the file conventions (`page`, `layout`, `loading`, `error`,
  `not-found`); ad-hoc client-side routing schemes are forbidden.
- Secrets and server-only logic MUST never be imported into client components.
- Imports across modules MUST use the `@/*` path alias rather than deep relative paths.
- Because Next.js APIs evolve quickly, contributors MUST consult the bundled docs in
  `node_modules/next/dist/docs/` when uncertain, rather than assuming prior-version
  behavior.

Rationale: server-first rendering minimizes shipped JavaScript, improves performance for
students on low-end devices, and keeps data access secure.

### IV. Testing Expectations

Every feature MUST ship with automated tests that verify its observable behavior.

- Business logic (deadline calculations, task status transitions, planning rules) MUST
  have unit tests covering happy paths and edge cases before the feature is merged.
- Interactive components MUST have component tests (React Testing Library style:
  assert on user-visible behavior, not implementation details).
- Critical student flows — creating an assignment, marking a task complete, viewing
  upcoming deadlines — MUST be covered by end-to-end tests.
- Bug fixes MUST include a regression test that fails without the fix.
- The full test suite, typecheck, and lint MUST pass in CI before merge; a red pipeline
  blocks all merges.

Rationale: students depend on accurate deadlines and task state; untested logic in these
areas directly harms users.

### V. Naming Conventions

Names MUST be consistent, descriptive, and free of abbreviations that are not
universally understood.

- React components and their files: `PascalCase` (e.g., `AssignmentCard.tsx`).
- Hooks: `camelCase` prefixed with `use` (e.g., `useDeadlineCountdown`).
- Non-component modules, utilities, and route segment folders: `kebab-case`
  (e.g., `date-utils.ts`, `app/study-plan/`).
- Variables and functions: `camelCase`; module-level constants: `UPPER_SNAKE_CASE`;
  types and interfaces: `PascalCase` without `I`/`T` prefixes.
- Booleans read as predicates (`isCompleted`, `hasDeadline`); event handlers are
  `handle<Event>` and handler props are `on<Event>`.
- Domain language is fixed: "assignment", "deadline", "task", and "study plan" MUST be
  used consistently in code, UI, and docs — do not introduce synonyms.

Rationale: a shared vocabulary and predictable casing make the codebase navigable and
reduce review friction.

### VI. Team Collaboration

All changes reach `main` through reviewed pull requests; direct pushes to `main` are
forbidden.

- Branches follow `<type>/<short-description>` (e.g., `feature/assignment-list`,
  `fix/deadline-timezone`).
- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
  `chore:`) with imperative, present-tense subjects.
- Every PR MUST have at least one approving review, a clear description of what and
  why, and passing CI (`lint`, `format`, `typecheck`, tests).
- PRs are kept small and focused on a single concern; unrelated changes are split out.
- Review feedback is resolved through discussion or follow-up commits — never by
  force-pushing over a reviewer's context without notice.

Rationale: lightweight, consistent process lets a student team move fast while keeping
`main` releasable at all times.

## Technology Stack Constraints

The required stack is fixed and MUST NOT be substituted without a constitution
amendment:

- **Framework**: Next.js (App Router) — currently 16.x — with React 19.
- **Language**: TypeScript 5.x in strict mode (Principle I).
- **Styling**: Tailwind CSS 4.x (Principle II).
- **Quality tooling**: ESLint 9 (`eslint-config-next`), Prettier with
  `prettier-plugin-tailwindcss` and `prettier-plugin-organize-imports`.
- **Runtime**: the Node.js version pinned in `.nvmrc`.

Adding any new runtime dependency requires justification in the PR description (what
problem it solves and why it cannot reasonably be built in-project). Prefer the platform
(Next.js, React, Web APIs) over libraries.

## Development Workflow & Quality Gates

- Work flows through Spec Kit: `/speckit.specify` → `/speckit.plan` → `/speckit.tasks`
  → implementation. Features MUST have an approved spec before implementation begins.
- Quality gates, in order, MUST pass locally before opening a PR and in CI before
  merge: `npm run lint`, `npm run format`, `npm run typecheck`, and the test suite.
- The auto-generated `nextjs-agent-rules` block in `AGENTS.md` is maintained by
  `next dev` and MUST NOT be hand-edited.
- Generated artifacts (`.next/`, `node_modules/`) are never committed.
- `main` MUST remain deployable at every commit.

## Governance

This constitution supersedes all other project practices. Where other documents
conflict with it, the constitution wins until amended.

- **Amendments**: proposed via pull request that modifies this file, including a Sync
  Impact Report, a version bump, and migration notes for any newly non-compliant code.
  Amendments require approval from the project maintainers.
- **Versioning**: semantic versioning — MAJOR for removed or redefined principles,
  MINOR for new principles or materially expanded guidance, PATCH for clarifications
  and wording fixes.
- **Compliance**: every pull request review MUST verify changes against these
  principles. Deviations MUST be either fixed before merge or explicitly justified in
  the PR description and accepted by the reviewer. Complexity is guilty until proven
  necessary.

**Version**: 1.0.0 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
