# Implementation Plan: Study-Mate Base UI Component Library

**Branch**: `6-design-a-base-components` | **Date**: 2026-11-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-base-ui-components/spec.md`

## Summary

Create eight reusable, typed UI primitives under `src/components/ui/` for the
dashboard, assignment management, and authentication contexts. Use native HTML
elements, Tailwind utilities backed by the existing Linear semantic theme tokens,
and shadcn-style variant and composition conventions without adding a component
library. Keep presentation components server-compatible and domain-agnostic.
Add focused component tests using a minimal development-only test setup because
the repository currently has no test runner and the constitution requires
interactive component tests.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode; React 19.3.0
**Primary Dependencies**: Next.js 16.4.5 and Tailwind CSS 4 (existing); planned test-only dependencies: `vitest`, `@testing-library/react`, `@testing-library/user-event`, and `jsdom`
**Storage**: N/A; components do not persist data
**Testing**: `vitest` and `@testing-library/react`; add a `test:components` script and one Vitest configuration
**Target Platform**: Modern desktop and mobile browsers through the Next.js App Router
**Project Type**: Web application with an internal shared component library
**Performance Goals**: Keep primitives presentational and server-compatible by default; add no production runtime dependency or unnecessary client-side state
**Constraints**: Use existing semantic theme variables; no arbitrary hex colors or custom CSS; no changes to the constitution or existing project-wide configuration; follow strict TypeScript and PascalCase component filenames
**Scale/Scope**: Eight primitives (Button, Card, Input, Select, Badge, List, Checkbox, Textarea), component contracts, and focused behavior tests; no page or domain workflow changes

### Test Dependency Justification

The following dependencies are proposed only for development and component
testing; each addresses a testing capability that the repository does not
currently provide:

- **`vitest`**: runs the automated component test suite; no test runner is
  currently configured.
- **`@testing-library/react`**: renders React components and provides
  user-observable DOM queries.
- **`@testing-library/user-event`**: simulates realistic keyboard and pointer
  interactions for accessibility and control-state tests.
- **`jsdom`**: supplies a DOM environment for Vitest component tests.

No new production/runtime UI dependency is proposed.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Plan decision | Gate |
|---|---|---|
| Strict TypeScript; no `any` | Define explicit public prop types and status/variant unions; no type escape hatches. | PASS |
| Tailwind utility-first styling | Use existing semantic color utilities and utility classes; add no stylesheet or ad hoc colors. | PASS |
| Next.js server-first components | Keep primitives free of local state and browser APIs; place client boundaries only in consumers that need event handling or state. | PASS |
| Automated testing | Add behavior tests for interactive components and render states. A test runner is absent, so add only test-specific development dependencies needed to satisfy this requirement. | PASS |
| Naming conventions | Use PascalCase filenames and component names under `src/components/ui/`. | PASS |
| Focused scope and collaboration | Do not change project-wide theme/constitution, database, routes, or unrelated navigation. | PASS |

No constitution violations require an exception. The planned test dependencies are
development-only and necessary because no test framework is present; no UI runtime
dependency is planned.

### Post-Design Constitution Re-check

**Gate: PASS.** The detailed component contracts retain strict typed props,
semantic Tailwind styling, native accessible controls, and server-compatible
presentation defaults. The justified Vitest setup is limited to test-specific
development dependencies; automated tests cover semantic theme usage and
accessible interaction states, while the browser review covers legibility,
contrast, and responsive layout. SC-007 is a post-implementation usability goal,
not a release gate; an unassisted review of 10 target students will assess whether
at least 9 identify the primary action, assignment status, and field error. No
global theme, existing project configuration, or constitution changes are planned.

## Project Structure

### Documentation (this feature)

```text
specs/003-base-ui-components/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui-component-contracts.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── globals.css                 # Existing semantic theme; unchanged
└── components/
    ├── Navigation.tsx              # Existing component; out of scope
    └── ui/
        ├── Button.tsx
        ├── Card.tsx
        ├── Input.tsx
        ├── Select.tsx
        ├── Badge.tsx
        ├── List.tsx
        ├── Checkbox.tsx
        ├── Textarea.tsx
        ├── types.ts                  # Shared variant and assignment-status types
        └── index.ts                 # Public component exports

tests/
└── components/
    └── ui/
        ├── Button.test.tsx
        ├── Card.test.tsx
        ├── Input.test.tsx
        ├── Select.test.tsx
        ├── Badge.test.tsx
        ├── List.test.tsx
        ├── Checkbox.test.tsx
        ├── Textarea.test.tsx
        └── ComponentContexts.test.tsx

vitest.config.ts                     # Minimal component-test configuration
```

**Structure Decision**: This is one existing Next.js application. Put reusable
primitives in the requested `src/components/ui/` directory, expose their public
exports from its index, and keep tests in a dedicated `tests/components/ui/`
tree. Retain all existing application and theme configuration. The single new
test-runner configuration is limited to the required component tests.

## Complexity Tracking

No exceptions or additional architectural layers are planned.
