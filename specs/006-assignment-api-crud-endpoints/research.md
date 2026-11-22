# Research: Assignment API CRUD Endpoints

## 1. API Route Handlers

**Decision:** Use Next.js App Router Route Handlers under `src/app/api/assignments/`.

**Rationale:** The project already uses the Next.js App Router. Route Handlers support the HTTP methods required for assignment CRUD operations, including GET, POST, PATCH, and DELETE.

**Alternatives considered:** Server Actions were considered, but Route Handlers provide explicit HTTP endpoints suitable for the requested API.

## 2. Authentication Provider

**Decision:** Authentication provider selection requires team confirmation. Clerk is the proposed option, not an approved or configured dependency at this stage.

**Rationale:** The student database schema already contains a unique `clerkId`, and the student model provides `findByClerkId()`. These support a possible mapping between a Clerk identity and a Study-Mate student record.

**Alternatives considered:** Another authentication provider could be selected by the team. Building custom authentication is not recommended because Next.js recommends established authentication libraries.

**Open dependency:** Confirm the provider with Mario and the team before implementing authentication integration. Do not assume Clerk is installed, configured, or approved.

## 3. Authentication and Authorization

**Decision:** Each API handler must verify the authenticated user's identity and resolve that identity to a student record before accessing assignments.

**Rationale:** Next.js documentation explains that Proxy checks are not a complete authorization solution. Authorization must also happen close to the data access and mutation operations.

All assignment queries and mutations must use the database student ID obtained from the authenticated user's student record. The API must never trust a student ID supplied by the client.

**Alternatives considered:** Relying only on Proxy authentication checks was rejected because it does not provide sufficient protection for individual data operations.

## 4. Database Access

**Decision:** Reuse the existing database service and assignment/student models.

**Rationale:** The project already uses PostgreSQL, Drizzle ORM, and a database service in `src/services/database.service.ts`. The assignment model already scopes operations by student ID and supports retrieving, creating, updating, and deleting assignments.

**Alternatives considered:** Writing database queries directly inside Route Handlers was rejected because it would duplicate existing model logic and make testing and maintenance harder.

## 5. Request Validation

**Decision:** Use the existing Zod dependency to validate request bodies and assignment identifiers.

**Rationale:** Zod is already installed and is used by the project's database configuration. Server-side validation can reject invalid input before database operations occur.

Create and update schemas must only accept permitted assignment fields. Clients must not be allowed to change assignment ownership.

**Alternatives considered:** Manual validation was rejected because Zod provides a consistent validation approach already used in the project.

## 6. HTTP Responses and Errors

**Decision:** Use consistent JSON responses and appropriate HTTP status codes.

- 200: Successful retrieval or update.
- 201: Assignment successfully created.
- 204: Assignment successfully deleted.
- 400: Invalid request body, identifier, or input.
- 401: User is not authenticated.
- 404: Student record or requested assignment is not found or is inaccessible.
- 500: Unexpected server error.

**Rationale:** Clear status codes help API consumers understand the result of each request. Returning 404 for inaccessible assignments avoids revealing whether another student's assignment exists.

**Alternatives considered:** Returning successful responses for failed operations was rejected because it would make errors difficult for API consumers to detect.

## 7. Testing

**Decision:** Use the existing Vitest and PGlite testing setup.

**Rationale:** The project already tests database models using Vitest and PGlite. The API tests can mock the authentication provider and verify authenticated and unauthenticated requests without requiring real user credentials.

Tests must cover successful CRUD operations, invalid input, missing records, authentication failures, and attempts to access another student's assignments.

**Alternatives considered:** Introducing another test framework or requiring a separate PostgreSQL test server was rejected because the existing setup already supports database testing.

## 8. Caching and Data Privacy

**Decision:** Keep assignment API responses user-specific and do not enable public caching.

**Rationale:** Assignment data belongs to individual students. Responses must not be shared between different authenticated users.

**Alternatives considered:** Public caching was rejected because it could expose private student assignment data.
