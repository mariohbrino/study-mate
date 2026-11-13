# Implementation Plan: Study Mate Dark and Light Theme

**Branch**: `7-add-color-schema-for-dark-and-light-theme` | **Date**: 2026-11-12 | **Spec**: `specs/002-dark-light-theme/spec.md`

**Input**: Feature specification from `specs/002-dark-light-theme/spec.md`

## Summary

Implement the approved Linear-inspired light and dark color schema in Study Mate using Tailwind CSS 4 semantic theme variables. Configure Inter and JetBrains Mono as the application's global fonts through Next.js font support. Use CSS variables and a `.dark` class for the theme definitions. Do not add a theme switcher, preference persistence, or a new runtime dependency in this feature.

## Technical Context

**Language/Version**: TypeScript 5, CSS

**Primary Dependencies**: Next.js 16.4.5, React 19.3.0, Tailwind CSS 4. No new runtime dependencies planned.

**Storage**: N/A. Theme tokens are defined in the global stylesheet. No database changes are required.

**Testing**: Existing quality commands: `npm run lint`, `npm run format`, `npm run typecheck`, and `npm run build`. Manually inspect the application in both theme states.

**Target Platform**: Next.js web application; modern desktop and mobile browsers.

**Project Type**: Full-stack web application.

**Performance Goals**: Avoid unnecessary client-side JavaScript and additional runtime dependencies. Use Next.js font optimization and shared CSS variables.

**Constraints**:

- Follow the project constitution and Tailwind CSS 4 conventions.
- Keep the existing Next.js App Router architecture.
- Define semantic design tokens instead of scattering hard-coded colors.
- Do not install `next-themes` without team approval.
- Use the documented palette values and review proposed values for sufficient contrast before implementation.
- Preserve existing application functionality.

**Scale/Scope**: One shared theme system, two theme definitions, seventeen semantic color tokens (twelve core roles and five foreground pairing roles), and two global font families.

## Constitution Check

| Constitution requirement | Plan compliance |
|---|---|
| Strict TypeScript | No new TypeScript types or unsafe casts are required. |
| Tailwind utility-first styling | Use Tailwind CSS 4 theme variables and semantic utilities. |
| Next.js App Router | Keep global styles and fonts in the existing root layout. |
| Server Components by default | No Client Component is required for the color schema. |
| Automated quality checks | Run existing lint, format, typecheck, and build commands. |
| Dependency justification | No new runtime dependency is planned. |
| Branch and PR workflow | Work on the assigned feature branch and submit a focused PR for review. |

**Initial Gate**: PASS. Proposed values for incomplete palette roles are documented in `research.md` and `data-model.md`. Contrast verification remains part of implementation validation.

**Phase 1 Re-check**: The design introduces no database changes, API contracts, or additional application projects. It remains within the existing architecture.

## Project Structure

### Documentation (this feature)

```text
specs/002-dark-light-theme/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── spec.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css
│   └── layout.tsx
├── configs/
├── database/
│   └── schemas/
├── types/
└── utils/
```

**Structure Decision**: Use the existing Next.js App Router structure. The theme variables will be defined in `src/app/globals.css`, and global font configuration will be handled in `src/app/layout.tsx`. No additional source directories are required.

## Complexity Tracking

No constitution violations or additional architectural complexity are planned.