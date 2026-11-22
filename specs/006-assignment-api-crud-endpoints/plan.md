# Implementation Plan: Assignment API CRUD Endpoints

**Branch**: `32-add-assignment-api-crud-endpoints` | **Date**: 2026-11-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-assignment-api-crud-endpoints/spec.md`

## Summary

Build secure REST API endpoints that allow authenticated students to create, view, update, and delete their own assignments. Use Next.js App Router Route Handlers, Zod validation, and the existing Drizzle assignment and student models. Resolve the authenticated user's identity to a student record before every assignment operation. The authentication provider must be confirmed by the team before provider-specific integration is implemented.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode; Node.js version pinned in `.nvmrc`.

**Primary Dependencies**: Next.js 16.x, React 19, Drizzle ORM, Zod 4.x. Authentication library is pending team confirmation.

**Storage**: Existing PostgreSQL database accessed through Drizzle ORM.

**Testing**: Vitest 4.x, PGlite, existing database test setup, and mocked authentication identity.

**Target Platform**: Next.js server runtime, deployed through the project's existing Vercel setup.

**Project Type**: Full-stack web application with server-side REST API endpoints.

**Performance Goals**: Reuse existing model methods and avoid unnecessary database queries. No numerical performance target is specified.

**Constraints**:
- Use strict TypeScript and do not use `any`.
- Keep database operations and authentication checks on the server.
- Verify authentication and assignment ownership on every request.
- Never trust a client-supplied student ID.
- Validate request bodies and UUID path parameters.
- Do not publicly cache student-specific assignment responses.
- Do not expose internal error details.
- Do not assume Clerk is installed or configured.
- Follow existing project formatting, naming, and testing conventions.

**Scale/Scope**: Five API operations across two route segments: collection GET/POST and individual assignment GET/PATCH/DELETE. Includes request schemas, authentication resolution, response handling, and automated tests.

## Constitution Check

| Principle | Status | Application |
|---|---|---|
| I. TypeScript Strictness | PASS | Use strict types and explicit public interfaces. |
| II. Utility-First Styling | PASS | No UI styling changes are required. |
| III. Next.js App Router Discipline | PASS | Use server-side Route Handlers under `src/app/api/`. |
| IV. Testing Expectations | PASS | Add automated tests for successful operations, validation, authentication, and ownership. |
| V. Naming Conventions | PASS | Use kebab-case for route folders and non-component modules. |
| VI. Team Collaboration | PASS | Work on the assigned feature branch and submit a reviewed PR. |

**Initial Gate: PASS WITH OPEN DEPENDENCY**

The proposed design follows the constitution. The authentication provider must be confirmed by the team before provider-specific implementation. This is a dependency, not permission to bypass authentication.

## Project Structure

### Documentation

```text
specs/006-assignment-api-crud-endpoints/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── assignments-api.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code

```text
src/
├── app/
│   └── api/
│       └── assignments/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── database/
│   └── schemas/
│       └── assignments.schema.ts
├── models/
│   ├── assignment.model.ts
│   └── student.model.ts
├── schemas/
│   └── assignments.schema.ts
├── services/
│   └── database.service.ts
└── types/
    └── assignment.type.ts

tests/
└── units/
    ├── assignment.model.test.ts
    └── student.model.test.ts
```

**Structure Decision**: Use the existing single Next.js application. Add two Route Handler segments for assignment collection and individual assignment operations. Reuse existing models and database schemas. Add request validation schemas under `src/schemas/`. Keep authentication resolution in a server-only helper appropriate to the confirmed provider.

## Complexity Tracking

No constitution violations or additional architectural layers are proposed. Existing models provide the required ownership-scoped database operations, so a new repository layer is unnecessary.

## Design Dependencies

1. Confirm the authentication provider with Mario and the team.
2. Confirm the provider's server-side identity API and testing approach.
3. Ensure the authenticated identity maps to an existing student record.
4. Keep all authorization checks in the server-side request handling path, not only in Proxy.