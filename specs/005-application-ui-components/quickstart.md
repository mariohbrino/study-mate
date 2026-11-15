# Quickstart: Application-Level Components

## Prerequisites

- Node.js version from `.nvmrc`
- Dependencies installed with `npm install`
- Existing Next.js, Vitest, and Testing Library dependencies
- `@playwright/test` development dependency and Chromium browser installed with
  `npx playwright install chromium`

Playwright is the only new test dependency: it is required to meet the constitution's
critical-flow E2E requirement, and the repository has no existing browser automation
tool. No runtime dependency or database migration is part of this feature.

## Automated Validation

Run from the repository root after implementation:

```powershell
npm run lint
npm run format
npm run typecheck
npm run test:components
npm run test:e2e
```

Vitest must discover tests throughout `tests/components/`, not only the existing
`tests/components/ui/` directory. Tests should verify observable behavior: header
navigation/current-page/menu state; assignment details and deadline labels; list
loading/error/empty/no-results/populated states; form validation, retained values,
pending and cancel behavior, including the 255-character limits for title, course,
and description; case-insensitive search, page reset, page slicing, query retention,
and clear; and pagination boundaries and page changes. `assignment-results.test.ts`
must verify filtering, stable deadline ordering, page slicing, query-change reset,
query retention while paging, and page clamping when results shrink.

Playwright must run against the existing `/` root route with the E2E environment flag
enabled. Its fixture uses in-memory assignment state only. It must cover creating and
editing an assignment, marking one completed, and viewing upcoming deadlines with
readable status. Manually verify that the ordinary root page remains unchanged when
the flag is disabled. Do not add an assignment product route or database writes for E2E.

## Manual Browser Review

In PowerShell, run `$env:STUDY_MATE_E2E='1'; npm run dev` to display the
environment-gated in-memory fixture on the existing root route. In a separate
PowerShell session, run
`Remove-Item Env:STUDY_MATE_E2E -ErrorAction SilentlyContinue; npm run dev` and verify
the ordinary root page is unchanged. Review Header keyboard navigation, current-page
indication, and narrow-screen menu, then review:

1. 320px and 1440px viewport widths, with no horizontal overflow or obscured content.
2. Light and dark themes, checking text, status, validation, and focus legibility.
3. Pointer hover and keyboard focus for navigation and actions.
4. Empty and populated list states; overdue and due-within-48-hours text; optional card
   actions.
5. Form errors and pending state, plus search and pagination at their boundaries.

Record the browser review with the implementation task evidence. The review does not
replace automated component or E2E tests.

## Student Usability Review

After the follow-on Assignment Page Integration feature provides the `/assignments`
route and data flow, run the specification's task-based review with 10 target
students. Without assistance, each participant must navigate to assignments, find a
specified assignment, and identify how to create or edit an assignment. Record the
participant count and successful completions; the criterion is at least 9 of 10
completing all tasks. This post-integration usability review is not a release gate for
the reusable component library itself.
