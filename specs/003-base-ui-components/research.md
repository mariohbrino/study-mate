# Research: Study-Mate Base UI Component Library

## Decisions

### 1. Use native HTML elements and no UI runtime dependency

**Decision**: Implement Button, Input, Select, Checkbox, and Textarea with their
native HTML elements. Use semantic containers for Card, Badge, and List. Keep
components presentational and data-agnostic.

**Rationale**: Native controls already provide form semantics, keyboard
operation, and assistive-technology behavior. The project has no installed
shadcn/ui, Radix, or other UI component package. The small set of required
controls does not justify adding one.

**Alternatives considered**: A custom Select/listbox or a component package was
rejected because it adds dependency and interaction complexity without a
requirement for custom selection behavior.

### 2. Follow shadcn-style APIs without installing shadcn/ui

**Decision**: Use small typed `variant` and `size` props where relevant, composable
Card content, and optional native element props. Keep variant class maps local
and explicit; do not add `class-variance-authority`, `clsx`, `tailwind-merge`,
Radix, or shadcn/ui solely for these primitives.

**Rationale**: The repository does not contain `components.json`, a `components/ui`
directory, or shadcn-related dependencies. The request asks to follow conventions,
not recreate or install the shadcn toolchain. The constitution requires PascalCase
component filenames, so use `Button.tsx`, etc., even though some shadcn
scaffolds use lowercase filenames.

**Alternatives considered**: Installing the shadcn CLI or its supporting packages
was rejected to preserve the existing configuration and avoid unnecessary
dependencies.

### 3. Preserve Next.js server-first boundaries

**Decision**: Do not add `"use client"` to primitives unless a component itself
requires local state, effects, or browser APIs. Keep loading, form submission,
validation timing, and business behavior with consuming workflows.

**Rationale**: The Next.js App Router treats components as Server Components by
default; a client directive creates a client module-graph boundary. These visual
wrappers can remain server-compatible while clients own event handlers and state.

**Alternatives considered**: Marking every primitive as a Client Component was
rejected because static presentation does not need browser state and broad client
boundaries increase shipped JavaScript.

### 4. Use only existing semantic theme utilities

**Decision**: Style with semantic utilities mapped in `src/app/globals.css`,
including background, foreground, card, primary, secondary, muted, accent,
border, input, ring, and destructive roles. Keep status text visible and check
actual foreground/background token-pair contrast against WCAG 2.2 AA in both
modes: at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for relevant
non-text controls.

**Rationale**: The project already maps its Linear-inspired CSS variables into
Tailwind 4 utilities. The theme has no dedicated success/warning tokens; new
hexadecimal colors or global theme edits are outside this component feature.

**Alternatives considered**: Adding status-specific palette values was rejected;
use existing semantic roles and text labels, and surface any contrast deficiency
for review without changing the theme here.

### 5. Add only the test tooling required by the constitution

**Decision**: Use `vitest`, `@testing-library/react`,
`@testing-library/user-event`, and `jsdom` as development-only dependencies,
with one minimal Vitest config and a `test:components` script.

**Rationale**: `package.json` has no test script or component-test framework.
The constitution requires automated tests for interactive components and
user-visible behavior. Each proposed development dependency supplies a distinct
missing test capability:

- **`vitest`** provides the test runner and assertions; no test runner is
  currently configured.
- **`@testing-library/react`** renders React components and supports queries based
  on user-visible DOM semantics.
- **`@testing-library/user-event`** simulates realistic keyboard and pointer
  input for interaction-state tests.
- **`jsdom`** provides the DOM environment required to run those component tests
  in Vitest.

None is a production dependency. Automated component tests verify semantic
theme usage and accessible interaction states; manual browser review verifies
legibility and layout in both color modes and at narrow and wide viewport sizes.

**Alternatives considered**: Manual-only review does not satisfy the automated
testing requirement. Adding a browser automation suite is unnecessary for these
isolated primitive tests; hover/focus appearance, contrast, responsive layout,
and color-mode legibility receive a manual browser validation pass.

## References

- Project constraints: `.specify/memory/constitution.md`
- Existing palette and token mapping: `docs/theme.md`, `src/app/globals.css`
- React native controls: [input](https://react.dev/reference/react-dom/components/input),
  [select](https://react.dev/reference/react-dom/components/select),
  [textarea](https://react.dev/reference/react-dom/components/textarea)
- Next.js component boundaries:
  [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components),
  [use client](https://nextjs.org/docs/app/api-reference/directives/use-client)
- Tailwind semantic theme utilities:
  [Theme variables](https://tailwindcss.com/docs/theme),
  [Dark mode](https://tailwindcss.com/docs/dark-mode)
- Component API convention: [shadcn Button](https://ui.shadcn.com/docs/components/base/button)
- Accessible tests: [Testing Library role queries](https://testing-library.com/docs/queries/byrole/),
  [user-event](https://testing-library.com/docs/user-event/intro/)
- Accessibility review: [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
