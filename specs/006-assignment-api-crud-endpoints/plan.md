# Implementation Plan: Assignment API Reads and Server Actions

**Branch**: `32-add-assignment-api-crud-endpoints` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-assignment-api-crud-endpoints/spec.md`

## Summary

Implement secure assignment reading and mutation operations for authenticated students.

Use Next.js App Router Route Handlers for retrieving assignments:

- `GET /api/assignments`
- `GET /api/assignments/[id]`

Use Next.js Server Actions for creating, updating, and deleting assignments.

Use the existing Drizzle assignment and student models. Resolve the authenticated Clerk user's identity to an existing Student record before performing any assignment operation. Use the Student database ID for all ownership checks.

Validate input with Zod, provide appropriate error and success feedback, and revalidate affected data after mutations.

## Technical Context

**Language/Version**: TypeScript 5.x, strict mode; Node.js version pinned in `.nvmrc`.

**Primary Dependencies**: Next.js 16.x, React 19, Drizzle ORM, Zod 4.x, and Clerk as the selected authentication provider. Clerk installation and application configuration must be verified before implementation.

**Storage**: Existing PostgreSQL database accessed through Drizzle ORM.

**Testing**: Vitest 4.x, PGlite, existing database test setup, and mocked authentication identity.

**Target Platform**: Next.js server runtime, deployed through the project's existing Vercel setup.

**Project Type**: Full-stack web application using API Route Handlers and Server Actions.

**Performance Goals**: Reuse existing model methods and avoid unnecessary database queries. No numerical performance target is specified.

**Constraints**:

- Use strict TypeScript and do not use `any`.
- Keep database operations and authentication checks on the server.
- Use API Route Handlers only for assignment GET operations.
- Use Server Actions for assignment creation, updating, and deletion.
- Resolve Clerk identity to the existing Student database record.
- Never trust a client-supplied student ID.
- Verify assignment ownership on every individual assignment operation.
- Validate input using Zod and validate UUID path parameters.
- Do not publicly cache student-specific assignment responses.
- Do not expose internal error details.
- Reuse existing assignment and student model methods.
- Verify Clerk installation and configuration before implementing provider-specific integration.
- Follow existing project formatting, naming, and testing conventions.

**Scale/Scope**: Two GET API operations and three Server Actions for assignment creation, updating, and deletion. Includes authentication resolution, validation, ownership checks, response handling, user feedback, and automated tests.

## Architecture Decisions

### 1. Assignment Read Operations

Use Next.js Route Handlers.

| Method | Endpoint | Responsibility |
|---|---|---|
| GET | `/api/assignments` | Retrieve the authenticated student's assignments. |
| GET | `/api/assignments/[id]` | Retrieve one assignment belonging to the authenticated student. |

The handlers must authenticate the user, resolve the Student record, and use the existing assignment model methods.

### 2. Assignment Mutation Operations

Use Next.js Server Actions.

| Action | Responsibility | Existing model method |
|---|---|---|
| Create | Create an assignment for the authenticated student. | `store()` |
| Update | Update an assignment owned by the authenticated student. | `update()` |
| Delete | Delete an assignment owned by the authenticated student. | `remove()` |

Server Actions must validate inputs, authenticate the user, resolve the Student record, enforce ownership, and revalidate affected data.

The client must never provide the authoritative Student ID.

### 3. Authentication and Ownership

Clerk is the selected authentication provider.

The server-side authentication helper will:

1. Retrieve the authenticated Clerk user identity.
2. Reject unauthenticated requests.
3. Find the corresponding Student record using `findByClerkId()`.
4. Reject users without an associated Student record.
5. Return the Student database ID for ownership-scoped operations.

The implementation must follow the team's confirmed Clerk configuration and existing conventions.

## Constitution Check

| Principle | Status | Application |
|---|---|---|
| I. TypeScript Strictness | PASS | Use strict types and explicit public interfaces. |
| II. Utility-First Styling | PASS | Follow existing styling conventions for any assignment feedback UI. |
| III. Next.js App Router Discipline | PASS | Use Route Handlers for GET requests and Server Actions for mutations. |
| IV. Testing Expectations | PASS | Add tests for API reads, Server Actions, validation, authentication, and ownership. |
| V. Naming Conventions | PASS | Follow existing project naming conventions. |
| VI. Team Collaboration | PASS | Work on the assigned feature branch and submit a reviewed PR. |

**Initial Gate: PASS WITH CONFIGURATION DEPENDENCY**

The architecture follows the project constitution and the team's agreed approach. Clerk application configuration and installation must be verified before authentication integration is implemented.

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

### Proposed Source Code

```text
src/
├── actions/
│   └── assignment.actions.ts
├── app/
│   └── api/
│       └── assignments/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── database/
│   └── schemas/
│       ├── assignments.schema.ts
│       └── students.schema.ts
├── models/
│   ├── assignment.model.ts
│   └── student.model.ts
├── schemas/
│   └── assignments.schema.ts
├── services/
│   ├── database.service.ts
│   └── assignment-auth.service.ts
└── types/
    └── assignment.type.ts

tests/
└── units/
    ├── assignment.model.test.ts
    ├── student.model.test.ts
    ├── assignments-api.test.ts
    └── assignment.actions.test.ts
```

The `actions/`, `schemas/`, and authentication helper locations are proposed locations. Confirm them against team conventions before creating files.

### Structure Decision

Use the existing single Next.js application.

- Add two Route Handler files for assignment GET operations.
- Add a Server Actions module for create, update, and delete operations.
- Add Zod validation schemas.
- Add a server-side authentication helper to resolve Clerk users to Student records.
- Reuse existing database schemas and model methods.
- Add automated tests following the repository's established testing conventions.

## Complexity Tracking

No constitution violations or unnecessary architectural layers are proposed.

Existing models already provide ownership-scoped database operations. A new repository layer is not required.

Server Actions are used for mutations because this is the architecture agreed upon by the team.

## Design Dependencies

1. Confirm the Clerk application and environment configuration with Mario and the team.
2. Verify the Clerk dependency and existing authentication setup.
3. Confirm the server-side Clerk identity API and testing approach.
4. Confirm the proposed locations for Server Actions, Zod schemas, and authentication helpers.
5. Ensure each authenticated Clerk user maps to an existing Student record.
6. Ensure all assignment operations use the authenticated Student database ID.
7. Confirm the GET API response format and Server Action result conventions with the existing project structure.