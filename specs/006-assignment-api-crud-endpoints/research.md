# Research: Assignment API Reads and Server Actions

## 1. Assignment Read Operations

**Decision:** Use Next.js App Router Route Handlers under `src/app/api/assignments/` for assignment retrieval.

The supported endpoints are:

- `GET /api/assignments`
- `GET /api/assignments/[id]`

**Rationale:** The project already uses the Next.js App Router. Route Handlers provide standard HTTP endpoints for retrieving assignment data and support the course requirement for API interaction between the client and server.

**Alternatives considered:** Using Server Actions for all operations was considered. The team agreed to use Route Handlers for GET requests and Server Actions for mutations.

## 2. Assignment Mutation Operations

**Decision:** Use Next.js Server Actions for creating, updating, and deleting assignments.

**Rationale:** Server Actions allow the application to perform mutations directly through server-side functions. They can reuse the existing assignment model without creating unnecessary HTTP mutation endpoints.

The three actions are:

- Create an assignment using `store()`.
- Update an assignment using `update()`.
- Delete an assignment using `remove()`.

Each action must validate input, authenticate the user, enforce ownership, and revalidate affected data.

**Alternatives considered:** POST, PATCH, and DELETE API Route Handlers were considered. The team agreed to use Server Actions for these mutations instead.

## 3. Authentication Provider

**Decision:** Use Clerk as the selected authentication provider.

**Rationale:** The student database schema already contains a unique `clerkId`, and the student model provides `findByClerkId()`. These support mapping an authenticated Clerk user to an existing Study-Mate student record.

**Implementation dependency:** Verify that the team's Clerk application, dependency, environment variables, and server-side configuration are available before implementing the integration. Do not assume that local configuration is already complete.

Never commit secret keys or share them in source code or public messages.

## 4. Authentication and Authorization

**Decision:** Every assignment API handler and Server Action must verify the authenticated user's identity and resolve that identity to a Student record before accessing assignment data.

**Rationale:** Authentication confirms the user's identity, while authorization ensures the user can only access their own assignments.

The server-side authentication process must:

1. Retrieve the authenticated Clerk user identity.
2. Reject unauthenticated users.
3. Find the Student record using `findByClerkId()`.
4. Reject users without an associated Student record.
5. Return the Student database ID for ownership-scoped operations.

All assignment queries and mutations must use this database Student ID. The application must never trust a Student ID supplied by the client.

Authorization must happen close to the data access and mutation operations. Relying only on Proxy authentication checks is insufficient.

**Alternatives considered:** Relying only on Proxy checks was rejected because individual data operations also need authorization.

## 5. Database Access

**Decision:** Reuse the existing database service and assignment/student models.

**Rationale:** The project already uses PostgreSQL, Drizzle ORM, and a database service in `src/services/database.service.ts`.

The assignment model already supports ownership-scoped operations:

- `get(studentId)` for retrieving assignments.
- `findById(id, studentId)` for retrieving one assignment.
- `store(studentId, data)` for creating an assignment.
- `update(id, studentId, data)` for updating an assignment.
- `remove(id, studentId)` for deleting an assignment.

**Alternatives considered:** Writing database queries directly inside Route Handlers or Server Actions was rejected because it would duplicate existing model logic and make testing and maintenance harder.

## 6. Request Validation

**Decision:** Use the existing Zod dependency to validate Server Action inputs and assignment identifiers.

**Rationale:** Zod is already installed and is used by the project's database configuration. Server-side validation can reject invalid input before database operations occur.

Create and update schemas must only accept permitted assignment fields. Clients must not be allowed to change assignment ownership or protected database fields.

The API must also validate assignment UUID path parameters before querying the database.

**Alternatives considered:** Manual validation was rejected because Zod provides a consistent validation approach already used in the project.

## 7. API Responses and Server Action Results

**Decision:** Use consistent JSON responses and appropriate HTTP status codes for GET API operations. Use structured success and error results for Server Actions.

**GET API status codes:**

- 200: Successful retrieval.
- 400: Invalid assignment identifier.
- 401: User is not authenticated.
- 404: Student record or requested assignment is not found or is inaccessible.
- 500: Unexpected server error.

**Server Action results:**

- Return a clear success result after a successful mutation.
- Return validation feedback for invalid input.
- Return an authentication or authorization error when access is not allowed.
- Return a safe error message when an unexpected failure occurs.

**Rationale:** Clear API status codes help API consumers understand retrieval results. Structured Server Action results allow the user interface to display useful feedback without exposing internal errors.

Returning 404 for inaccessible assignments avoids revealing whether another student's assignment exists.

## 8. Testing

**Decision:** Use the existing Vitest and PGlite testing setup.

**Rationale:** The project already tests database models using Vitest and PGlite. API and Server Action tests can mock the authentication provider and verify authenticated and unauthenticated operations without requiring real user credentials.

Tests must cover:

- Successful assignment retrieval.
- Successful assignment creation.
- Successful assignment updates.
- Successful assignment deletion.
- Invalid input and UUID values.
- Missing Student records.
- Authentication failures.
- Attempts to access another student's assignments.
- Database errors and unsuccessful operations.

**Alternatives considered:** Introducing another test framework or requiring a separate PostgreSQL test server was rejected because the existing setup already supports database testing.

## 9. Caching and Data Privacy

**Decision:** Keep assignment API responses user-specific and do not enable public caching.

**Rationale:** Assignment data belongs to individual students. Responses must not be shared between different authenticated users.

Both GET handlers must ensure that the authenticated Student ID is used when retrieving data.

**Alternatives considered:** Public caching was rejected because it could expose private student assignment data.

## 10. User Interface Feedback and Revalidation

**Decision:** Provide validation messages, pending states, success feedback, and error feedback for assignment mutations. Revalidate affected data after successful Server Actions.

**Rationale:** Students should receive clear feedback when they create, update, or delete assignments. Revalidation helps ensure that displayed assignment information reflects the latest database state.

**Implementation considerations:**

- Prevent repeated submissions while an action is pending.
- Display validation errors near the relevant form fields where appropriate.
- Display success or failure feedback after an action.
- Refresh or revalidate affected assignment data after successful mutations.

## 11. Proposed File Organization

The following locations are proposed and should be checked against existing team conventions before implementation:

- `src/actions/assignment.actions.ts` for Server Actions.
- `src/schemas/assignments.schema.ts` for Zod validation.
- `src/services/assignment-auth.service.ts` for Clerk-to-Student resolution.
- `src/app/api/assignments/route.ts` for the collection GET handler.
- `src/app/api/assignments/[id]/route.ts` for the individual GET handler.